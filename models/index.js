const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 1. Model: User
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  fullName: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'accountant', 'recruiter', 'client'), defaultValue: 'recruiter' },
  clientId: { type: DataTypes.INTEGER, allowNull: true },
  avatar: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// 2. Model: Client (Khách hàng Doanh nghiệp)
const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING(200), allowNull: false },
  taxCode: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  address: { type: DataTypes.STRING(255) },
  contactPerson: { type: DataTypes.STRING(100) },
  contactEmail: { type: DataTypes.STRING(100) },
  contactPhone: { type: DataTypes.STRING(20) },
  paymentTermDays: { type: DataTypes.INTEGER, defaultValue: 30 }, // Net 30
  status: { type: DataTypes.STRING(50), defaultValue: 'Active' }
});

// 3. Model: Job (Vị trí tuyển dụng)
const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(150), allowNull: false },
  department: { type: DataTypes.STRING(100) },
  salaryRange: { type: DataTypes.STRING(100) },
  feeRatePercent: { type: DataTypes.FLOAT, defaultValue: 15.0 }, // Phí dịch vụ %
  status: { type: DataTypes.STRING(50), defaultValue: 'Opening' }
});

// 4. Model: Candidate (Ứng viên)
const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  currentPosition: { type: DataTypes.STRING(100) },
  status: { type: DataTypes.STRING(50), defaultValue: 'Available' }
});

// 5. Model: Placement (Deal Onboard thành công)
const Placement = sequelize.define('Placement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  recruiterId: { type: DataTypes.INTEGER, allowNull: false },
  officialSalary: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  serviceFee: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  onboardDate: { type: DataTypes.DATEONLY, allowNull: false },
  warrantyDays: { type: DataTypes.INTEGER, defaultValue: 60 },
  warrantyEndDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.STRING(50), defaultValue: 'UnderWarranty' } // UnderWarranty, Passed, Failed
});

// 6. Model: Invoice (Hóa đơn dịch vụ & công nợ)
const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceCode: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  placementId: { type: DataTypes.INTEGER, allowNull: true },
  subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  vatRate: { type: DataTypes.FLOAT, defaultValue: 8.0 },
  vatAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  paidAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  remainingAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  issueDate: { type: DataTypes.DATEONLY, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING(50), defaultValue: 'Sent' } // Draft, Sent, Partial, Paid, Overdue, Cancelled
});

// 7. Model: Payment (Thanh toán & Thu nợ)
const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  paymentDate: { type: DataTypes.DATEONLY, allowNull: false },
  paymentMethod: { type: DataTypes.STRING(50), defaultValue: 'BankTransfer' },
  referenceCode: { type: DataTypes.STRING(100) },
  notes: { type: DataTypes.TEXT }
});

// 8. Model: AuditLog (Nhật ký hệ thống)
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING(100), allowNull: false },
  module: { type: DataTypes.STRING(50), allowNull: false },
  details: { type: DataTypes.TEXT }
});

// Thiết lập quan hệ (Associations)
Client.hasMany(Job, { foreignKey: 'clientId' });
Job.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(Placement, { foreignKey: 'clientId' });
Placement.belongsTo(Client, { foreignKey: 'clientId' });

Job.hasMany(Placement, { foreignKey: 'jobId' });
Placement.belongsTo(Job, { foreignKey: 'jobId' });

Candidate.hasMany(Placement, { foreignKey: 'candidateId' });
Placement.belongsTo(Candidate, { foreignKey: 'candidateId' });

User.hasMany(Placement, { foreignKey: 'recruiterId' });
Placement.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

Client.hasMany(Invoice, { foreignKey: 'clientId' });
Invoice.belongsTo(Client, { foreignKey: 'clientId' });

Placement.hasOne(Invoice, { foreignKey: 'placementId' });
Invoice.belongsTo(Placement, { foreignKey: 'placementId' });

Invoice.hasMany(Payment, { foreignKey: 'invoiceId' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Client.hasMany(User, { foreignKey: 'clientId' });
User.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = {
  sequelize,
  User,
  Client,
  Job,
  Candidate,
  Placement,
  Invoice,
  Payment,
  AuditLog
};
