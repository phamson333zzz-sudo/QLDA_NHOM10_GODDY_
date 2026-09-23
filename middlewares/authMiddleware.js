const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'goddy_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token xác thực không hợp lệ hoặc đã hết hạn!' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện chức năng này!'
      });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };