const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Khởi tạo máy chủ ứng dụng GODDY Recruit
const { sequelize } = require('./models');
const seedData = require('./config/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (Frontend Dashboard & Assets với MIME type chuẩn)
app.use(express.static(path.join(__dirname, 'public')));

// Khai báo các Router API cho các phân hệ
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/debt', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));

// Route trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware xử lý lỗi 404 cho API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});

// Khởi chạy máy chủ và đồng bộ CSDL SQLite
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('[Database] Kết nối cơ sở dữ liệu SQLite thành công!');

    // Khởi tạo bảng và nạp dữ liệu mẫu
    await seedData();

    app.listen(PORT, () => {
      console.log('===============================================================');
      console.log(` GODDY RECRUIT - Quản lý Hóa đơn, Công nợ & Tuyển dụng (Nhóm 10)`);
      console.log(` Máy chủ đang chạy tại: http://localhost:${PORT}`);
      console.log('===============================================================');
    });
  } catch (err) {
    console.error('[Error] Không thể khởi động máy chủ:', err);
  }
}

// Khởi chạy nếu file được gọi trực tiếp
if (require.main === module) {
  startServer();
}

module.exports = app;