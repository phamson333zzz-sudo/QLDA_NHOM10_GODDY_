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