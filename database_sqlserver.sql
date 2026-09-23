USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'QLDA_NHOM10_GODDY')
BEGIN
    CREATE DATABASE QLDA_NHOM10_GODDY;
END;
GO

USE QLDA_NHOM10_GODDY;
GO

-- 1. BẢNG NGƯỜI DÙNG (USERS)
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    fullName NVARCHAR(100) NOT NULL,
    role NVARCHAR(20) DEFAULT 'recruiter', -- 'admin', 'accountant', 'recruiter'
    avatar NVARCHAR(MAX) NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. BẢNG KHÁCH HÀNG DOANH NGHIỆP B2B (CLIENTS)
IF OBJECT_ID('dbo.Clients', 'U') IS NOT NULL DROP TABLE dbo.Clients;
CREATE TABLE dbo.Clients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    companyName NVARCHAR(200) NOT NULL,
    taxCode NVARCHAR(50) NOT NULL UNIQUE,
    address NVARCHAR(255) NULL,
    contactPerson NVARCHAR(100) NULL,
    contactEmail NVARCHAR(100) NULL,
    contactPhone NVARCHAR(20) NULL,
    paymentTermDays INT DEFAULT 30, -- Net 15, Net 30, Net 45, Net 60
    status NVARCHAR(50) DEFAULT 'Active',
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO