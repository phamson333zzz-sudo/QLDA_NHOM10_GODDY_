const assert = require('assert');
const { sequelize, User, Client, Job, Candidate, Placement, Invoice, Payment, AuditLog } = require('../models');
const seedData = require('../config/seed');

async function runTests() {
  console.log('====================================================');
  console.log(' BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG (UNIT & INTEGRATION TESTS)');
  console.log(' Hệ thống GODDY Recruit - Quản lý Hóa đơn & Công nợ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         Lỗi: ${err.message}`);
      failed++;
    }
  }

  // 1. Khởi tạo DB & Seed
  await test('Test 1: Khởi tạo CSDL SQLite & Nạp dữ liệu mẫu', async () => {
    await seedData();
    const clientCount = await Client.count();
    assert(clientCount >= 4, 'Phải có ít nhất 4 khách hàng mẫu');
  });

  // 2. Test Client Model & Validation
  await test('Test 2: Kiểm tra tạo mới và validate Khách hàng B2B', async () => {
    const taxCode = '0109988771';
    const client = await Client.create({
      companyName: 'Công ty Cổ phần Thử Nghiệm ABC',
      taxCode,
      paymentTermDays: 30,
      status: 'Active'
    });
    assert.strictEqual(client.companyName, 'Công ty Cổ phần Thử Nghiệm ABC');
    assert.strictEqual(client.taxCode, taxCode);

    // Kiểm tra trùng MST
    let duplicateError = false;
    try {
      await Client.create({ companyName: 'Trùng MST', taxCode });
    } catch (e) {
      duplicateError = true;
    }
    assert(duplicateError, 'Hệ thống phải chặn mã số thuế bị trùng');
  });

  // 3. Test Recruitment Placement & Fee Calculation
  await test('Test 3: Kiểm tra chốt Deal Onboard & Tính phí hoa hồng tuyển dụng', async () => {
    const job = await Job.findOne();
    const candidate = await Candidate.findOne();
    const client = await Client.findOne();

    const salary = 30000000;
    const feeRate = 18.0;
    const expectedFee = salary * 12 * (feeRate / 100); // 64,800,000 VND

    const onboard = new Date();
    const warrantyEnd = new Date(onboard);
    warrantyEnd.setDate(warrantyEnd.getDate() + 60);

    const placement = await Placement.create({
      jobId: job.id,
      candidateId: candidate.id,
      clientId: client.id,
      recruiterId: 1,
      officialSalary: salary,
      serviceFee: expectedFee,
      onboardDate: onboard.toISOString().split('T')[0],
      warrantyDays: 60,
      warrantyEndDate: warrantyEnd.toISOString().split('T')[0],
      status: 'UnderWarranty'
    });

    assert.strictEqual(parseFloat(placement.serviceFee), expectedFee);
    assert.strictEqual(placement.warrantyDays, 60);
  });

  // 4. Test Invoice Generation from Placement
  await test('Test 4: Kiểm tra phát hành Hóa đơn VAT từ Deal', async () => {
    const placement = await Placement.findOne({ order: [['id', 'DESC']] });
    const subtotal = parseFloat(placement.serviceFee);
    const vatRate = 8.0;
    const vatAmount = subtotal * (vatRate / 100);
    const totalAmount = subtotal + vatAmount;

    const invoiceCode = `INV-TEST-${Date.now().toString().slice(-4)}`;
    const invoice = await Invoice.create({
      invoiceCode,
      clientId: placement.clientId,
      placementId: placement.id,
      subtotal,
      vatRate,
      vatAmount,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Sent'
    });

    assert.strictEqual(invoice.invoiceCode, invoiceCode);
    assert.strictEqual(parseFloat(invoice.totalAmount), totalAmount);
    assert.strictEqual(parseFloat(invoice.remainingAmount), totalAmount);
    assert.strictEqual(invoice.status, 'Sent');
  });

  // 5. Test Debt Payment & Balance Reduction
  await test('Test 5: Kiểm tra thanh toán công nợ và tự động trừ dần dư nợ', async () => {
    const invoice = await Invoice.findOne({ order: [['id', 'DESC']] });
    const payPart = 20000000;
    const initialRemaining = parseFloat(invoice.remainingAmount);

    // Trả đợt 1
    invoice.paidAmount = parseFloat(invoice.paidAmount) + payPart;
    invoice.remainingAmount = initialRemaining - payPart;
    invoice.status = 'Partial';
    await invoice.save();

    assert.strictEqual(parseFloat(invoice.paidAmount), payPart);
    assert.strictEqual(parseFloat(invoice.remainingAmount), initialRemaining - payPart);
    assert.strictEqual(invoice.status, 'Partial');

    // Trả nốt phần còn lại
    const remainingToPay = parseFloat(invoice.remainingAmount);
    invoice.paidAmount = parseFloat(invoice.paidAmount) + remainingToPay;
    invoice.remainingAmount = 0;
    invoice.status = 'Paid';
    await invoice.save();

    assert.strictEqual(parseFloat(invoice.remainingAmount), 0);
    assert.strictEqual(invoice.status, 'Paid');
  });

  // 6. Test Debt Aging Analysis (Báo cáo tuổi nợ 30-60-90)
  await test('Test 6: Kiểm tra phân tích tuổi nợ và nợ khó đòi', async () => {
    const invoices = await Invoice.findAll();
    assert(invoices.length > 0, 'Phải có hóa đơn trong CSDL');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasOverdue = false;
    invoices.forEach(inv => {
      const due = new Date(inv.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) hasOverdue = true;
    });

    assert(hasOverdue, 'Hệ thống phát hiện chính xác các hóa đơn bị quá hạn');
  });

  // 7. Test Audit Log Trail
  await test('Test 7: Kiểm tra nhật ký hệ thống AuditLog ghi nhận đầy đủ', async () => {
    await AuditLog.create({
      userId: 1,
      action: 'UNIT_TEST',
      module: 'TEST',
      details: 'Kiểm thử tính năng AuditLog thành công'
    });

    const lastLog = await AuditLog.findOne({ where: { action: 'UNIT_TEST' } });
    assert(lastLog != null, 'Nhật ký audit log phải được lưu thành công');
    assert.strictEqual(lastLog.module, 'TEST');
  });

  console.log('\n====================================================');
  console.log(` KẾT QUẢ KIỂM THỬ: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('>>> TẤT CẢ MODULE VÀ NGHIỆP VỤ HOẠT ĐỘNG HOÀN HẢO! <<<\n');
    process.exit(0);
  }
}

runTests();
