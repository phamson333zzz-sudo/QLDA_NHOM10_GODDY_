/**
 * Module: Quản Lý Deal Tuyển Dụng & Bảo Hành (Placements)
 */
async function loadPlacements() {
  try {
    const res = await fetch('/api/recruitment/placements');
    const data = await res.json();
    const tbody = document.getElementById('placementsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!data.placements || data.placements.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Chưa có deal tuyển dụng nào.</td></tr>';
      return;
    }
    data.placements.forEach(p => {
      const isWarranty = p.status === 'UnderWarranty';
      const hasInvoice = p.Invoice != null;
      tbody.innerHTML += `
        <tr>
          <td><strong>${p.Candidate ? p.Candidate.fullName : '-'}</strong></td>
          <td>${p.Job ? p.Job.title : '-'}</td>
          <td>${p.Client ? p.Client.companyName : '-'}</td>
          <td>${formatMoney(p.officialSalary)}</td>
          <td class="text-success fw-bold">${formatMoney(p.serviceFee)}</td>
          <td><i class="fa-regular fa-calendar-check me-1"></i>${p.warrantyEndDate || '-'}</td>
          <td><span class="status-badge ${isWarranty ? 'badge-warranty' : 'badge-passed'}">${p.status}</span></td>
          <td>
            ${hasInvoice ? `<span class="badge bg-success">${p.Invoice.invoiceCode}</span>` : `
              <button class="btn btn-sm btn-outline-primary" onclick="quickIssueInvoice(${p.id})">
                <i class="fa-solid fa-file-invoice me-1"></i>Xuất HĐ
              </button>
            `}
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Lỗi tải deal tuyển dụng:', err);
  }
}

async function openModalAddPlacement() {
  const formEl = document.getElementById('formAddPlacement');
  if (formEl) formEl.reset();

  const onboardDateEl = document.getElementById('placementOnboardDate');
  if (onboardDateEl) onboardDateEl.valueAsDate = new Date();

  try {
    // Load clients
    const resClients = await fetch('/api/clients');
    const dClients = await resClients.json();
    const clientSelect = document.getElementById('placementClientId');
    if (clientSelect) {
      clientSelect.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
      (dClients.clients || []).forEach(c => {
        clientSelect.innerHTML += `<option value="${c.id}">${c.companyName}</option>`;
      });
    }

    // Load candidates
    const resCand = await fetch('/api/recruitment/candidates');
    const dCand = await resCand.json();
    const candSelect = document.getElementById('placementCandidateId');
    if (candSelect) {
      candSelect.innerHTML = '<option value="">-- Chọn ứng viên --</option>';
      (dCand.candidates || []).forEach(c => {
        candSelect.innerHTML += `<option value="${c.id}">${c.fullName} (${c.currentPosition || ''})</option>`;
      });
    }

    const modalEl = document.getElementById('modalAddPlacement');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    } else {
      alert('Không tìm thấy hộp thoại thêm deal!');
    }
  } catch (err) {
    console.error('Lỗi mở modal deal:', err);
  }
}

async function onSelectClientForPlacement() {
  const cIdEl = document.getElementById('placementClientId');
  const cId = cIdEl ? cIdEl.value : null;
  const jobSelect = document.getElementById('placementJobId');
  if (!jobSelect) return;

  jobSelect.innerHTML = '<option value="">-- Đang tải vị trí... --</option>';
  if (!cId) {
    jobSelect.innerHTML = '<option value="">-- Chọn khách hàng trước --</option>';
    return;
  }

  try {
    const res = await fetch('/api/recruitment/jobs');
    const d = await res.json();
    const clientJobs = (d.jobs || []).filter(j => j.clientId == cId);
    jobSelect.innerHTML = '';
    if (clientJobs.length === 0) {
      jobSelect.innerHTML = '<option value="">(Khách hàng này chưa có Job mở)</option>';
    } else {
      clientJobs.forEach(j => {
        jobSelect.innerHTML += `<option value="${j.id}">${j.title} (${j.department})</option>`;
      });
    }
  } catch (err) {
    jobSelect.innerHTML = '<option value="">(Lỗi tải danh sách job)</option>';
  }
}

function calcPlacementFee() {
  const salEl = document.getElementById('placementSalary');
  const rateEl = document.getElementById('placementFeeRate');
  const estFeeEl = document.getElementById('placementEstFee');

  const salary = parseFloat(salEl ? salEl.value : 0) || 0;
  const rate = parseFloat(rateEl ? rateEl.value : 18) || 18;
  // Headhunt standard: rate% của lương năm (12 tháng)
  const fee = salary * 12 * (rate / 100);
  if (estFeeEl) estFeeEl.value = formatMoney(fee);
}

async function submitAddPlacement(e) {
  e.preventDefault();
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  };

  const body = {
    clientId: getVal('placementClientId'),
    jobId: getVal('placementJobId'),
    candidateId: getVal('placementCandidateId'),
    officialSalary: getVal('placementSalary'),
    feeRatePercent: getVal('placementFeeRate'),
    onboardDate: getVal('placementOnboardDate'),
    warrantyDays: getVal('placementWarrantyDays')
  };

  try {
    const res = await fetch('/api/recruitment/placements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      const modalEl = document.getElementById('modalAddPlacement');
      if (modalEl) {
        const modalInst = bootstrap.Modal.getInstance(modalEl);
        if (modalInst) modalInst.hide();
      }
      alert('Ghi nhận deal tuyển dụng thành công!');
      loadPlacements();
    } else {
      alert(data.message || 'Lỗi khi chốt deal!');
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!');
  }
}

async function quickIssueInvoice(placementId) {
  if (!confirm('Bạn có chắc chắn muốn phát hành hóa đơn VAT cho deal tuyển dụng này?')) return;
  try {
    const res = await fetch('/api/invoices/from-placement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placementId, vatRate: 8.0 })
    });
    const data = await res.json();
    if (data.success) {
      alert(`Phát hành hóa đơn thành công! Mã HĐ: ${data.invoice.invoiceCode}`);
      loadPlacements();
    } else {
      alert(data.message || 'Lỗi phát hành hóa đơn!');
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!');
  }
}