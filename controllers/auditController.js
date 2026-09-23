const { AuditLog, User } = require('../models');

// Lay lich su thao tac he thong (Audit Trail)
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['id', 'DESC']],
      limit: 100
    });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
