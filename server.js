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
