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

-- 3. BẢNG VỊ TRÍ TUYỂN DỤNG (JOBS)
IF OBJECT_ID('dbo.Jobs', 'U') IS NOT NULL DROP TABLE dbo.Jobs;
CREATE TABLE dbo.Jobs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    clientId INT NOT NULL,
    title NVARCHAR(150) NOT NULL,
    department NVARCHAR(100) NULL,
    salaryRange NVARCHAR(100) NULL,
    feeRatePercent FLOAT DEFAULT 18.0,
    status NVARCHAR(50) DEFAULT 'Opening',
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Jobs_Clients FOREIGN KEY (clientId) REFERENCES dbo.Clients(id) ON DELETE CASCADE
);
GO

-- 4. BẢNG ỨNG VIÊN (CANDIDATES)
IF OBJECT_ID('dbo.Candidates', 'U') IS NOT NULL DROP TABLE dbo.Candidates;
CREATE TABLE dbo.Candidates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fullName NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NULL,
    currentPosition NVARCHAR(100) NULL,
    status NVARCHAR(50) DEFAULT 'Available', -- 'Available', 'Interviewing', 'Placed'
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 5. BẢNG DEAL TUYỂN DỤNG ONBOARD (PLACEMENTS)
IF OBJECT_ID('dbo.Placements', 'U') IS NOT NULL DROP TABLE dbo.Placements;
CREATE TABLE dbo.Placements (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobId INT NOT NULL,
    candidateId INT NOT NULL,
    clientId INT NOT NULL,
    recruiterId INT NOT NULL,
    officialSalary DECIMAL(15,2) NOT NULL,
    serviceFee DECIMAL(15,2) NOT NULL,
    onboardDate DATE NOT NULL,
    warrantyDays INT DEFAULT 60,
    warrantyEndDate DATE NULL,
    status NVARCHAR(50) DEFAULT 'UnderWarranty', -- 'UnderWarranty', 'Passed', 'Failed'
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Placements_Jobs FOREIGN KEY (jobId) REFERENCES dbo.Jobs(id),
    CONSTRAINT FK_Placements_Candidates FOREIGN KEY (candidateId) REFERENCES dbo.Candidates(id),
    CONSTRAINT FK_Placements_Clients FOREIGN KEY (clientId) REFERENCES dbo.Clients(id),
    CONSTRAINT FK_Placements_Users FOREIGN KEY (recruiterId) REFERENCES dbo.Users(id)
);
GO

-- 6. BẢNG HÓA ĐƠN DỊCH VỤ & CÔNG NỢ (INVOICES)
IF OBJECT_ID('dbo.Invoices', 'U') IS NOT NULL DROP TABLE dbo.Invoices;
CREATE TABLE dbo.Invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoiceCode NVARCHAR(50) NOT NULL UNIQUE,
    clientId INT NOT NULL,
    placementId INT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    vatRate FLOAT DEFAULT 8.0,
    vatAmount DECIMAL(15,2) DEFAULT 0,
    totalAmount DECIMAL(15,2) NOT NULL,
    paidAmount DECIMAL(15,2) DEFAULT 0,
    remainingAmount DECIMAL(15,2) NOT NULL,
    issueDate DATE NOT NULL,
    dueDate DATE NOT NULL,
    status NVARCHAR(50) DEFAULT 'Sent', -- 'Sent', 'Partial', 'Paid', 'Overdue', 'Cancelled'
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Invoices_Clients FOREIGN KEY (clientId) REFERENCES dbo.Clients(id),
    CONSTRAINT FK_Invoices_Placements FOREIGN KEY (placementId) REFERENCES dbo.Placements(id)
);
GO