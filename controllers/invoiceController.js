const { Invoice, Client, Placement, Candidate, Job, Payment, AuditLog } = require('../models');
const { Op } = require('sequelize');

// Lấy danh sách hóa đơn (có lọc theo trạng thái và tìm kiếm)
exports.getInvoices = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.invoiceCode = { [Op.like]: `%${search}%` };
    }

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Client, attributes: ['id', 'companyName', 'taxCode', 'address', 'contactPerson', 'paymentTermDays'] },
        {
          model: Placement,
          include: [
            { model: Candidate, attributes: ['id', 'fullName', 'email'] },
            { model: Job, attributes: ['id', 'title'] }
          ]
        },
        { model: Payment }
      ],
      order: [['id', 'DESC']]
    });

    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
