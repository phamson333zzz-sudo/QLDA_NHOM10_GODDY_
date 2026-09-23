const bcrypt = require('bcryptjs');
const { sequelize, User, Client, Job, Candidate, Placement, Invoice, Payment, AuditLog } = require('../models');

async function seedData() {
  try {
    await sequelize.sync({ force: true });
    console.log('[Seed] Đã đồng bộ bảng CSDL SQLite thành công.');

    const hashPassword = await bcrypt.hash('123456', 10);

    // 1. Tạo Users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@goddy.vn',
      password: hashPassword,
      fullName: 'Huỳnh Nguyễn Vĩnh Phúc (Admin)',
      role: 'admin'
    });

    const accountant = await User.create({
      username: 'ketoan',
      email: 'ketoan@goddy.vn',
      password: hashPassword,
      fullName: 'Phạm Sơn (Kế toán trưởng)',
      role: 'accountant'
    });

    const recruiter = await User.create({
      username: 'recruiter',
      email: 'recruiter@goddy.vn',
      password: hashPassword,
      fullName: 'Nguyễn Văn Minh (Senior Recruiter)',
      role: 'recruiter'
    });

    // 2. Tạo Clients (Doanh nghiệp B2B)
    const client1 = await Client.create({
      companyName: 'Công ty Cổ phần FPT Software',
      taxCode: '0101778163',
      address: 'Khu Công nghệ cao Hòa Lạc, Hà Nội',
      contactPerson: 'Trần Thu Hà',
      contactEmail: 'hr@fpt.com',
      contactPhone: '0901234567',
      paymentTermDays: 30,
      status: 'Active'
    });

    const client2 = await Client.create({
      companyName: 'Công ty Cổ phần VNG Corporation',
      taxCode: '0303885514',
      address: 'VNG Campus, Quận 7, TP. Hồ Chí Minh',
      contactPerson: 'Nguyễn Hoàng Long',
      contactEmail: 'talent@vng.com.vn',
      contactPhone: '0988776655',
      paymentTermDays: 30,
      status: 'Active'
    });

    const client3 = await Client.create({
      companyName: 'Công ty TNHH Shopee Việt Nam',
      taxCode: '0313339944',
      address: 'Saigon Centre, Quận 1, TP. Hồ Chí Minh',
      contactPerson: 'Lê Thùy Dương',
      contactEmail: 'recruitment@shopee.vn',
      contactPhone: '0912348899',
      paymentTermDays: 45,
      status: 'Active'
    });

    const client4 = await Client.create({
      companyName: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel',
      taxCode: '0100109106',
      address: 'Số 1 Trần Hữu Dực, Cầu Giấy, Hà Nội',
      contactPerson: 'Phạm Quang Huy',
      contactEmail: 'contact@viettelsolutions.vn',
      contactPhone: '0977112233',
      paymentTermDays: 30,
      status: 'Active'
    });

    // Tạo các tài khoản người dùng đại diện cho Khách hàng Doanh nghiệp (Client Role)
    await User.create({
      username: 'fpt_client',
      email: 'hr@fpt.com',
      password: hashPassword,
      fullName: 'Trần Thu Hà (FPT Software)',
      role: 'client',
      clientId: client1.id
    });

    await User.create({
      username: 'vng_client',
      email: 'talent@vng.com.vn',
      password: hashPassword,
      fullName: 'Nguyễn Hoàng Long (VNG Corporation)',
      role: 'client',
      clientId: client2.id
    });

    await User.create({
      username: 'shopee_client',
      email: 'recruitment@shopee.vn',
      password: hashPassword,
      fullName: 'Lê Thùy Dương (Shopee Việt Nam)',
      role: 'client',
      clientId: client3.id
    });

    // 3. Tạo Jobs (Vị trí tuyển dụng)
    const job1 = await Job.create({
      clientId: client1.id,
      title: 'Senior NodeJS / Backend Engineer',
      department: 'Phần mềm Tài chính (Fintech)',
      salaryRange: '35 - 45 triệu VND',
      feeRatePercent: 18.0,
      status: 'Opening'
    });

    const job2 = await Job.create({
      clientId: client2.id,
      title: 'DevOps / Cloud Specialist (AWS)',
      department: 'Hạ tầng Game & Cloud',
      salaryRange: '40 - 55 triệu VND',
      feeRatePercent: 20.0,
      status: 'Opening'
    });

    const job3 = await Job.create({
      clientId: client3.id,
      title: 'Product Manager E-commerce',
      department: 'Khối Nền tảng Bán lẻ',
      salaryRange: '50 - 65 triệu VND',
      feeRatePercent: 20.0,
      status: 'Closed'
    });

    const job4 = await Job.create({
      clientId: client4.id,
      title: 'AI / Machine Learning Engineer',
      department: 'Trung tâm AI Viettel',
      salaryRange: '45 - 60 triệu VND',
      feeRatePercent: 20.0,
      status: 'Opening'
    });

    // 4. Tạo Candidates (Ứng viên)
    const cand1 = await Candidate.create({
      fullName: 'Trần Văn Hoàng',
      email: 'hoang.tran@gmail.com',
      phone: '0933112244',
      currentPosition: 'Senior NodeJS Developer',
      status: 'Placed'
    });

    const cand2 = await Candidate.create({
      fullName: 'Lê Thị Thu Thảo',
      email: 'thao.le@gmail.com',
      phone: '0944556677',
      currentPosition: 'DevOps Engineer',
      status: 'Placed'
    });

    const cand3 = await Candidate.create({
      fullName: 'Nguyễn Đăng Khoa',
      email: 'khoa.dang@gmail.com',
      phone: '0978998877',
      currentPosition: 'Product Lead',
      status: 'Placed'
    });

    const cand4 = await Candidate.create({
      fullName: 'Vũ Đức Thịnh',
      email: 'thinh.vu@gmail.com',
      phone: '0911223344',
      currentPosition: 'AI Researcher',
      status: 'Available'
    });

    // 5. Tạo Placements (Deals tuyển dụng thành công)
    // Deal 1: FPT - Lương 40tr, Phí 18% của 12 tháng = 86.4tr, Onboard cách đây 70 ngày
    const onboard1 = new Date();
    onboard1.setDate(onboard1.getDate() - 75);
    const warrantyEnd1 = new Date(onboard1);
    warrantyEnd1.setDate(warrantyEnd1.getDate() + 60);

    const placement1 = await Placement.create({
      jobId: job1.id,
      candidateId: cand1.id,
      clientId: client1.id,
      recruiterId: recruiter.id,
      officialSalary: 40000000,
      serviceFee: 72000000, // 1.8 tháng lương
      onboardDate: onboard1.toISOString().split('T')[0],
      warrantyDays: 60,
      warrantyEndDate: warrantyEnd1.toISOString().split('T')[0],
      status: 'Passed'
    });

    // Deal 2: VNG - Lương 45tr, Phí 2 tháng = 90tr, Onboard cách đây 40 ngày (Quá hạn thanh toán 10 ngày)
    const onboard2 = new Date();
    onboard2.setDate(onboard2.getDate() - 40);
    const warrantyEnd2 = new Date(onboard2);
    warrantyEnd2.setDate(warrantyEnd2.getDate() + 60);

    const placement2 = await Placement.create({
      jobId: job2.id,
      candidateId: cand2.id,
      clientId: client2.id,
      recruiterId: recruiter.id,
      officialSalary: 45000000,
      serviceFee: 90000000,
      onboardDate: onboard2.toISOString().split('T')[0],
      warrantyDays: 60,
      warrantyEndDate: warrantyEnd2.toISOString().split('T')[0],
      status: 'UnderWarranty'
    });

    // Deal 3: Shopee - Lương 55tr, Phí 2 tháng = 110tr, Onboard cách đây 15 ngày (Còn trong hạn thanh toán)
    const onboard3 = new Date();
    onboard3.setDate(onboard3.getDate() - 15);
    const warrantyEnd3 = new Date(onboard3);
    warrantyEnd3.setDate(warrantyEnd3.getDate() + 60);

    const placement3 = await Placement.create({
      jobId: job3.id,
      candidateId: cand3.id,
      clientId: client3.id,
      recruiterId: recruiter.id,
      officialSalary: 55000000,
      serviceFee: 110000000,
      onboardDate: onboard3.toISOString().split('T')[0],
      warrantyDays: 60,
      warrantyEndDate: warrantyEnd3.toISOString().split('T')[0],
      status: 'UnderWarranty'
    });

    // 6. Tạo Invoices (Hóa đơn và Công nợ)
    // Hóa đơn 1 (FPT): Quá hạn >60 ngày (Nợ khó đòi)
    // Phát hành 70 ngày trước, hạn trả 40 ngày trước
    const issueDate1 = new Date();
    issueDate1.setDate(issueDate1.getDate() - 70);
    const dueDate1 = new Date(issueDate1);
    dueDate1.setDate(dueDate1.getDate() + 30); // Quá hạn 40 ngày -> nhóm 31-60 ngày

    const total1 = 72000000 * 1.08;
    const inv1 = await Invoice.create({
      invoiceCode: 'INV-2026-0001',
      clientId: client1.id,
      placementId: placement1.id,
      subtotal: 72000000,
      vatRate: 8.0,
      vatAmount: 5760000,
      totalAmount: total1,
      paidAmount: 30000000,
      remainingAmount: total1 - 30000000,
      issueDate: issueDate1.toISOString().split('T')[0],
      dueDate: dueDate1.toISOString().split('T')[0],
      status: 'Partial'
    });

    // Hóa đơn 2 (VNG): Quá hạn 1-30 ngày
    const issueDate2 = new Date();
    issueDate2.setDate(issueDate2.getDate() - 40);
    const dueDate2 = new Date(issueDate2);
    dueDate2.setDate(dueDate2.getDate() + 30); // Quá hạn 10 ngày -> nhóm 1-30 ngày

    const total2 = 90000000 * 1.08;
    const inv2 = await Invoice.create({
      invoiceCode: 'INV-2026-0002',
      clientId: client2.id,
      placementId: placement2.id,
      subtotal: 90000000,
      vatRate: 8.0,
      vatAmount: 72000000 * 0.1,
      totalAmount: total2,
      paidAmount: 0,
      remainingAmount: total2,
      issueDate: issueDate2.toISOString().split('T')[0],
      dueDate: dueDate2.toISOString().split('T')[0],
      status: 'Overdue'
    });

    // Hóa đơn 3 (Shopee): Đang trong hạn trả (Chưa quá hạn)
    const issueDate3 = new Date();
    issueDate3.setDate(issueDate3.getDate() - 15);
    const dueDate3 = new Date(issueDate3);
    dueDate3.setDate(dueDate3.getDate() + 45); // Còn 30 ngày nữa mới đến hạn

    const total3 = 110000000 * 1.08;
    const inv3 = await Invoice.create({
      invoiceCode: 'INV-2026-0003',
      clientId: client3.id,
      placementId: placement3.id,
      subtotal: 110000000,
      vatRate: 8.0,
      vatAmount: 8800000,
      totalAmount: total3,
      paidAmount: 0,
      remainingAmount: total3,
      issueDate: issueDate3.toISOString().split('T')[0],
      dueDate: dueDate3.toISOString().split('T')[0],
      status: 'Sent'
    });

    // Hóa đơn 4 (FPT): Đã quá hạn >75 ngày (Nhóm nợ khó đòi >60 ngày)
    const issueDate4 = new Date();
    issueDate4.setDate(issueDate4.getDate() - 110);
    const dueDate4 = new Date(issueDate4);
    dueDate4.setDate(dueDate4.getDate() + 30); // Quá hạn 80 ngày

    const total4 = 50000000 * 1.08;
    await Invoice.create({
      invoiceCode: 'INV-2025-0099',
      clientId: client1.id,
      placementId: null,
      subtotal: 50000000,
      vatRate: 8.0,
      vatAmount: 4000000,
      totalAmount: total4,
      paidAmount: 0,
      remainingAmount: total4,
      issueDate: issueDate4.toISOString().split('T')[0],
      dueDate: dueDate4.toISOString().split('T')[0],
      status: 'Overdue'
    });

    // 7. Tạo Payments (Lịch sử thanh toán mẫu)
    const payDate1 = new Date();
    payDate1.setDate(payDate1.getDate() - 25);
    await Payment.create({
      invoiceId: inv1.id,
      amount: 30000000,
      paymentDate: payDate1.toISOString().split('T')[0],
      paymentMethod: 'BankTransfer',
      referenceCode: 'FT26088219921',
      notes: 'Thanh toán đợt 1 hóa đơn INV-2026-0001 từ FPT Software'
    });

    // 8. Tạo AuditLog
    await AuditLog.create({
      userId: admin.id,
      action: 'SYSTEM_INIT',
      module: 'SYSTEM',
      details: 'Hệ thống GODDY Recruit khởi tạo cơ sở dữ liệu mẫu thành công.'
    });

    console.log('[Seed] Đã nạp đầy đủ dữ liệu mẫu cho cả 8 Module!');
  } catch (error) {
    console.error('[Seed Error] Lỗi khởi tạo dữ liệu mẫu:', error);
  }
}

module.exports = seedData;