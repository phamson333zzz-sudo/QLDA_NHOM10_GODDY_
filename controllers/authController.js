const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, AuditLog } = require('../models');

// Đăng nhập hệ thống
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên tài khoản và mật khẩu!' });
    }

    const user = await User.findOne({ where: { username: username.trim() } });
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