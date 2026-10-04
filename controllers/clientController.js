const { Client, Job, Candidate, Placement, Invoice, Payment, AuditLog } = require('../models');
const { Op } = require('sequelize');

// Lấy danh sách khách hàng doanh nghiệp (có tìm kiếm & lọc)
exports.getClients = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { taxCode: { [Op.like]: `%${search}%` } },
        { contactPerson: { [Op.like]: `%${search}%` } }
      ];
    }


    if (status && status !== 'All') {
      where.status = status;
    }

    const clients = await Client.findAll({
      where,
      include: [
        { model: Job, attributes: ['id', 'title', 'status'] },
        { model: Invoice, attributes: ['id', 'invoiceCode', 'totalAmount', 'remainingAmount', 'status'] }
      ],
      order: [['id', 'DESC']]
    });

    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Lấy thông tin chi tiết một khách hàng
exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id, {
            include: [Job, Placement, Invoice]
        });

        if (!client) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng!' });
        }

        res.json({ success: true, client });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Thêm mới khách hàng doanh nghiệp
exports.createClient = async (req, res) => {
    try {
        const { companyName, taxCode, address, contactPerson, contactEmail, contactPhone, paymentTermDays } = req.body;

        if (!companyName || !taxCode) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập tên công ty và mã số thuế!' });
        }

        // Kiểm tra định dạng mã số thuế (10 hoặc 13 số)
        const cleanTaxCode = taxCode.trim().replace('-', '');
        if (!/^\d{10}(\d{3})?$/.test(cleanTaxCode)) {
            return res.status(400).json({ success: false, message: 'Mã số thuế không hợp lệ! (Phải gồm 10 hoặc 13 chữ số)' });
        }
        // Kiểm tra trùng lặp MST
        const exist = await Client.findOne({ where: { taxCode: cleanTaxCode } });
        if (exist) {
            return res.status(400).json({ success: false, message: 'Mã số thuế này đã tồn tại trong hệ thống!' });
        }

        const newClient = await Client.create({
            companyName: companyName.trim(),
            taxCode: cleanTaxCode,
            address: address ? address.trim() : '',
            contactPerson: contactPerson ? contactPerson.trim() : '',
            contactEmail: contactEmail ? contactEmail.trim() : '',
            contactPhone: contactPhone ? contactPhone.trim() : '',
            paymentTermDays: parseInt(paymentTermDays) || 30,
            status: 'Active'
        });

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'CREATE_CLIENT',
            module: 'CLIENTS',
            details: `Thêm mới đối tác B2B: ${newClient.companyName} (MST: ${newClient.taxCode})`
        });

        res.status(201).json({ success: true, message: 'Thêm khách hàng thành công!', client: newClient });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Cập nhật thông tin khách hàng
exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, address, contactPerson, contactEmail, contactPhone, paymentTermDays, status } = req.body;

        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để cập nhật!' });
        }

        if (companyName) client.companyName = companyName.trim();
        if (address !== undefined) client.address = address.trim();
        if (contactPerson !== undefined) client.contactPerson = contactPerson.trim();
        if (contactEmail !== undefined) client.contactEmail = contactEmail.trim();
        if (contactPhone !== undefined) client.contactPhone = contactPhone.trim();
        if (paymentTermDays !== undefined) client.paymentTermDays = parseInt(paymentTermDays);
        if (status !== undefined) client.status = status;

        await client.save();

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'UPDATE_CLIENT',
            module: 'CLIENTS',
            details: `Cập nhật thông tin khách hàng ID ${id}: ${client.companyName}`
        });

        res.json({ success: true, message: 'Cập nhật thông tin khách hàng thành công!', client });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Xóa khách hàng (hoặc chuyển trạng thái Ngừng hoạt động)
exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng!' });
        }
        // Kiểm tra xem khách hàng có hóa đơn còn nợ không
        const openInvoices = await Invoice.count({
            where: { clientId: id, status: { [Op.in]: ['Sent', 'Partial', 'Overdue'] } }
        });

        if (openInvoices > 0) {
            return res.status(400).json({
                success: false,
                message: `Khách hàng này hiện có ${openInvoices} hóa đơn chưa tất toán công nợ, không thể xóa!`
            });
        }

        const companyName = client.companyName;
        await client.destroy();

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'DELETE_CLIENT',
            module: 'CLIENTS',
            details: `Đã xóa khách hàng: ${companyName} (ID: ${id})`
        });

        res.json({ success: true, message: `Đã xóa khách hàng ${companyName} thành công!` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Lấy toàn bộ dữ liệu tổng hợp cho Cổng thông tin Khách hàng (Client Portal)
exports.getClientPortalData = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id, {
            include: [
                { model: Job },
                {
                    model: Placement,
                    include: [
                        { model: Candidate, attributes: ['id', 'fullName', 'email', 'phone', 'currentPosition'] },
                        { model: Job, attributes: ['id', 'title', 'department'] }
                    ]
                },
                {
                    model: Invoice,
                    include: [{ model: Payment }]
                }
            ]
        });

        if (!client) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin khách hàng!' });
        }

        let totalInvoiced = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
        let overdueCount = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const invoices = (client.Invoices || []).map(inv => {
            const invObj = inv.toJSON();
            totalInvoiced += parseFloat(inv.totalAmount || 0);
            totalPaid += parseFloat(inv.paidAmount || 0);
            totalRemaining += parseFloat(inv.remainingAmount || 0);

            const dueDate = new Date(inv.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const overdueDays = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
            invObj.overdueDays = overdueDays;
            if (overdueDays > 0 && inv.remainingAmount > 0) {
                overdueCount++;
            }
            return invObj;
        });

        const activeJobs = (client.Jobs || []).filter(j => j.status === 'Opening').length;
        const placements = client.Placements || [];
        const warrantyActive = placements.filter(p => p.status === 'UnderWarranty').length;

        res.json({
            success: true,
            client: {
                id: client.id,
                companyName: client.companyName,
                taxCode: client.taxCode,
                address: client.address,
                contactPerson: client.contactPerson,
                contactEmail: client.contactEmail,
                contactPhone: client.contactPhone,
                paymentTermDays: client.paymentTermDays,
                status: client.status
            },
            summary: {
                totalInvoiced,
                totalPaid,
                totalRemaining,
                overdueCount,
                totalJobs: (client.Jobs || []).length,
                activeJobs,
                totalPlacements: placements.length,
                warrantyActive
            },
            invoices,
            jobs: client.Jobs || [],
            placements
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};