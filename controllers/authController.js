const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, AuditLog } = require('../models');
const { Op } = require('sequelize');

// Đăng nhập hệ thống
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên tài khoản và mật khẩu!' });
    }



    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username.trim() },
          { email: username.trim() }
        ]
      }
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, fullName: user.fullName, clientId: user.clientId },
      process.env.JWT_SECRET || 'goddy_secret_key_2026',
      { expiresIn: '7d' }
    );

    await AuditLog.create({
      userId: user.id,
      action: 'LOGIN',
      module: 'AUTH',
      details: `Người dùng ${user.fullName} (${user.role}) đăng nhập hệ thống thành công.`
    });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        clientId: user.clientId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Đăng ký tài khoản nhân viên mới
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin đăng ký!' });
    }

    const existingUser = await User.findOne({ where: { username: username.trim() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tên tài khoản này đã được sử dụng!' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.trim(),
      email: email.trim(),
      password: hashPassword,
      fullName: fullName.trim(),
      role: role || 'recruiter',
      isActive: true
    });

    await AuditLog.create({
      userId: req.user ? req.user.id : null,
      action: 'REGISTER_USER',
      module: 'AUTH',
      details: `Tạo mới tài khoản nhân viên: ${newUser.username} (${newUser.fullName}, vai trò: ${newUser.role})`
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        email: newUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy danh sách người dùng trong hệ thống
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']]
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Đổi mật khẩu cá nhân (TASK-213)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const targetUserId = (req.user && req.user.id) || userId;

    if (!targetUserId || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ mật khẩu cũ và mật khẩu mới!' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản người dùng!' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác!' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await AuditLog.create({
      userId: user.id,
      action: 'CHANGE_PASSWORD',
      module: 'AUTH',
      details: `Người dùng ${user.username} (${user.fullName}) đã đổi mật khẩu thành công.`
    });

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Khóa / Mở khóa tài khoản người dùng (TASK-214)
exports.toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản người dùng!' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const actionText = user.isActive ? 'Mở khóa' : 'Khóa';
    await AuditLog.create({
      userId: req.user ? req.user.id : null,
      action: 'TOGGLE_USER_STATUS',
      module: 'AUTH',
      details: `${actionText} tài khoản người dùng: ${user.username} (${user.fullName})`
    });

    res.json({
      success: true,
      message: `${actionText} tài khoản thành công!`,
      isActive: user.isActive
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
