const { Invoice, Client, Payment, Placement, AuditLog } = require('../models');
const { Op } = require('sequelize');

// Tổng hợp công nợ & Báo cáo phân tích tuổi nợ (Aging Report)
exports.getDebtOverview = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: {
        status: { [Op.in]: ['Sent', 'Partial', 'Overdue'] },
        remainingAmount: { [Op.gt]: 0 }
      },
      include: [
        { model: Client, attributes: ['id', 'companyName', 'taxCode', 'contactPerson', 'contactPhone', 'contactEmail'] }
      ],
      order: [['dueDate', 'ASC']]
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalReceivable = 0; // Tổng công nợ phải thu
    let overdueDebt = 0;     // Tổng nợ quá hạn
    let currentDebt = 0;     // Nợ trong hạn (chưa tới hạn trả)
    let aging0to30 = 0;      // Quá hạn 1-30 ngày
    let aging31to60 = 0;     // Quá hạn 31-60 ngày
    let agingAbove60 = 0;    // Quá hạn > 60 ngày (Nợ khó đòi)

    const debtList = invoices.map(inv => {
      const remaining = parseFloat(inv.remainingAmount);
      totalReceivable += remaining;

      const due = new Date(inv.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let agingCategory = 'Trong hạn';
      let overdueDays = 0;

      if (diffDays <= 0) {
        currentDebt += remaining;
        agingCategory = 'Trong hạn';
      } else {
        overdueDays = diffDays;
        overdueDebt += remaining;

        if (diffDays <= 30) {
          agingCategory = 'Quá hạn 1 - 30 ngày';
          aging0to30 += remaining;
        } else if (diffDays <= 60) {
          agingCategory = 'Quá hạn 31 - 60 ngày';
          aging31to60 += remaining;
        } else {
          agingCategory = 'Nợ khó đòi (> 60 ngày)';
          agingAbove60 += remaining;
        }
      }

      return {
        ...inv.toJSON(),
        overdueDays,
        agingCategory
      };
    });

    res.json({
      success: true,
      summary: {
        totalReceivable,
        overdueDebt,
        currentDebt,
        aging0to30,
        aging31to60,
        agingAbove60,
        totalInvoicesWithDebt: invoices.length
      },
      debtList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Ghi nhận thanh toán hóa đơn (Thu hồi công nợ)
exports.recordPayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, referenceCode, notes } = req.body;

    if (!invoiceId || !amount) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn hóa đơn và nhập số tiền thanh toán!' });
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền thanh toán phải lớn hơn 0!' });
    }

    const invoice = await Invoice.findByPk(invoiceId, { include: [Client] });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn cần thanh toán!' });
    }

    const currentRemaining = parseFloat(invoice.remainingAmount);
    if (payAmount > currentRemaining) {
      return res.status(400).json({
        success: false,
        message: `Số tiền thanh toán (${payAmount.toLocaleString()}đ) không được vượt quá số nợ còn lại (${currentRemaining.toLocaleString()}đ)!`
      });
    }

    const newPaidAmount = parseFloat(invoice.paidAmount) + payAmount;
    const newRemaining = Math.max(0, parseFloat(invoice.totalAmount) - newPaidAmount);

    invoice.paidAmount = newPaidAmount;
    invoice.remainingAmount = newRemaining;
    invoice.status = (newRemaining <= 0) ? 'Paid' : 'Partial';
    await invoice.save();

    const payment = await Payment.create({
      invoiceId: invoice.id,
      amount: payAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'BankTransfer',
      referenceCode: referenceCode ? referenceCode.trim() : `PAY-${Date.now().toString().slice(-6)}`,
      notes: notes ? notes.trim() : ''
    });

    await AuditLog.create({
      userId: req.user ? req.user.id : null,
      action: 'RECORD_PAYMENT',
      module: 'DEBT',
      details: `Thu tiền nợ thành công: ${payAmount.toLocaleString()}đ cho hóa đơn ${invoice.invoiceCode} (${invoice.Client.companyName}). Số nợ còn lại: ${newRemaining.toLocaleString()}đ`
    });

    res.status(201).json({
      success: true,
      message: `Ghi nhận thanh toán ${payAmount.toLocaleString()}đ thành công!`,
      payment,
      invoice
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Gửi nhắc nợ đối tác (Notification / Email Mock)
exports.sendDebtReminder = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await Invoice.findByPk(invoiceId, { include: [Client] });
    if (!invoice) return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn!' });

    await AuditLog.create({
      userId: req.user ? req.user.id : null,
      action: 'DEBT_REMINDER',
      module: 'DEBT',
      details: `Đã gửi thông báo nhắc hạn thanh toán cho hóa đơn ${invoice.invoiceCode} tới đối tác ${invoice.Client.companyName} (${invoice.Client.contactEmail})`
    });

    res.json({
      success: true,
      message: `Đã gửi lời nhắc thanh toán công nợ thành công tới đại diện ${invoice.Client.companyName}!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};