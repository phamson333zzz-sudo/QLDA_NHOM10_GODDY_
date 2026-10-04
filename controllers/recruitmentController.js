const { Job, Candidate, Placement, Client, User, Invoice, AuditLog } = require('../models');

// =================== 1. QUẢN LÝ JOBS (VỊ TRÍ TUYỂN DỤNG) ===================

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: Client, attributes: ['id', 'companyName', 'taxCode'] }],
      order: [['id', 'DESC']]
    });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.createJob = async (req, res) => {
    try {
        const { clientId, title, department, salaryRange, feeRatePercent } = req.body;
        if (!clientId || !title) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn khách hàng và nhập tên vị trí!' });
        }

        const job = await Job.create({
            clientId,
            title: title.trim(),
            department: department ? department.trim() : 'Công nghệ thông tin',
            salaryRange: salaryRange || 'Thỏa thuận',
            feeRatePercent: parseFloat(feeRatePercent) || 18.0,
            status: 'Opening'
        });

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'CREATE_JOB',
            module: 'RECRUITMENT',
            details: `Đăng tuyển vị trí mới: ${job.title} (ID: ${job.id})`
        });

        res.status(201).json({ success: true, message: 'Tạo vị trí tuyển dụng thành công!', job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, department, salaryRange, feeRatePercent, status } = req.body;

        const job = await Job.findByPk(id);
        if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy vị trí tuyển dụng!' });

        if (title) job.title = title.trim();
        if (department) job.department = department.trim();
        if (salaryRange) job.salaryRange = salaryRange;
        if (feeRatePercent) job.feeRatePercent = parseFloat(feeRatePercent);
        if (status) job.status = status;

        await job.save();
        res.json({ success: true, message: 'Cập nhật vị trí tuyển dụng thành công!', job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// =================== 2. QUẢN LÝ CANDIDATES (ỨNG VIÊN) ===================
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({ order: [['id', 'DESC']] });
        res.json({ success: true, candidates });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createCandidate = async (req, res) => {
    try {
        const { fullName, email, phone, currentPosition } = req.body;
        if (!fullName || !email) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập họ tên và email của ứng viên!' });
        }

        const candidate = await Candidate.create({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '',
            currentPosition: currentPosition ? currentPosition.trim() : 'Chuyên viên',
            status: 'Available'
        });

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'CREATE_CANDIDATE',
            module: 'RECRUITMENT',
            details: `Thêm hồ sơ ứng viên mới: ${candidate.fullName}`
        });

        res.status(201).json({ success: true, message: 'Thêm ứng viên thành công!', candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// =================== 3. QUẢN LÝ PLACEMENTS (DEAL CHỐT ONBOARD) ===================
exports.getPlacements = async (req, res) => {
    try {
        const placements = await Placement.findAll({
            include: [
                { model: Job, attributes: ['id', 'title', 'department'] },
                { model: Candidate, attributes: ['id', 'fullName', 'email', 'phone'] },
                { model: Client, attributes: ['id', 'companyName', 'taxCode', 'paymentTermDays'] },
                { model: User, as: 'recruiter', attributes: ['id', 'fullName', 'username'] },
                { model: Invoice, attributes: ['id', 'invoiceCode', 'status', 'totalAmount', 'remainingAmount'] }
            ],
            order: [['id', 'DESC']]
        });
        res.json({ success: true, placements });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createPlacement = async (req, res) => {
    try {
        const { jobId, candidateId, clientId, recruiterId, officialSalary, feeRatePercent, onboardDate, warrantyDays } = req.body;

        if (!jobId || !candidateId || !clientId || !officialSalary || !onboardDate) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc của deal tuyển dụng!' });
        }

        const salary = parseFloat(officialSalary);
        if (isNaN(salary) || salary <= 0) {
            return res.status(400).json({ success: false, message: 'Mức lương chính thức phải là số dương lớn hơn 0!' });
        }
        // Tính phí dịch vụ Headhunt:
        // Chuẩn thị trường: Nếu tỉ lệ < 50% => tính theo % lương năm (annual salary * rate / 100), tương đương khoảng 1.5 - 2.5 tháng lương
        // Hoặc nếu người dùng nhập số tiền trực tiếp:
        const rate = parseFloat(feeRatePercent) || 18.0;
        let serviceFee = req.body.serviceFee ? parseFloat(req.body.serviceFee) : null;
        if (!serviceFee) {
            if (rate <= 30.0) {
                // Phí theo % lương năm: (Lương tháng * 12) * (rate / 100)
                serviceFee = salary * 12 * (rate / 100);
            } else {
                // Hoặc tính theo % lương tháng (ví dụ 150% - 200%)
                serviceFee = salary * (rate / 100);
            }
        }

        const days = parseInt(warrantyDays) || 60;
        const onboard = new Date(onboardDate);
        const warrantyEnd = new Date(onboard);
        warrantyEnd.setDate(warrantyEnd.getDate() + days);

        const placement = await Placement.create({
            jobId,
            candidateId,
            clientId,
            recruiterId: recruiterId || 1,
            officialSalary: salary,
            serviceFee,
            onboardDate,
            warrantyDays: days,
            warrantyEndDate: warrantyEnd.toISOString().split('T')[0],
            status: 'UnderWarranty'
        });
        // Cập nhật trạng thái ứng viên và Job
        await Candidate.update({ status: 'Placed' }, { where: { id: candidateId } });

        await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action: 'CREATE_PLACEMENT',
            module: 'RECRUITMENT',
            details: `Chốt deal tuyển dụng ID ${placement.id}: Phí dịch vụ ${serviceFee.toLocaleString()}đ, Bảo hành đến ${placement.warrantyEndDate}`
        });

        res.status(201).json({ success: true, message: 'Ghi nhận deal tuyển dụng onboard thành công!', placement });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};