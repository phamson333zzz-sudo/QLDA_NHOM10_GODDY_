/**
 * Module: Quản Lý Hóa Đơn Dịch Vụ Tuyển Dụng (Invoices)
 */
async function loadInvoices() {
  const statusEl = document.getElementById('invoiceFilterStatus');
  const status = statusEl ? statusEl.value : '';
  const url = status ? `/api/invoices?status=${status}` : '/api/invoices';
  try {
    const res = await fetch(url);
    const data = await res.json();
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!data.invoices || data.invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Không có hóa đơn nào phù hợp.</td></tr>';
      return;
    }
    data.invoices.forEach(inv => {
      let badgeClass = 'badge-sent';
      if (inv.status === 'Paid') badgeClass = 'badge-paid';
      if (inv.status === 'Partial') badgeClass = 'badge-partial';
      if (inv.status === 'Overdue') badgeClass = 'badge-overdue';

      tbody.innerHTML += `
        <tr>
          <td><strong>${inv.invoiceCode}</strong></td>
          <td>${inv.Client ? inv.Client.companyName : '-'}</td>
          <td class="fw-bold">${formatMoney(inv.totalAmount)}</td>
          <td class="text-success">${formatMoney(inv.paidAmount)}</td>
          <td class="text-danger fw-bold">${formatMoney(inv.remainingAmount)}</td>
          <td>${inv.dueDate}</td>
          <td><span class="status-badge ${badgeClass}">${inv.status}</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary" onclick="viewInvoiceDetail(${inv.id})">
              <i class="fa-solid fa-file-lines me-1"></i>Xem & In
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Lỗi tải danh sách hóa đơn:', err);
  }
}

async function viewInvoiceDetail(invoiceId) {
  try {
    const res = await fetch(`/api/invoices/${invoiceId}`);
    const data = await res.json();
    if (!data.success || !data.invoice) return alert('Không tìm thấy thông tin hóa đơn!');
    const inv = data.invoice;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt('invDetailCode', inv.invoiceCode);
    setTxt('invDetailIssueDate', inv.issueDate);
    setTxt('invDetailDueDate', inv.dueDate);
    setTxt('invDetailClientName', inv.Client ? inv.Client.companyName : '-');
    setTxt('invDetailTaxCode', inv.Client ? inv.Client.taxCode : '-');
    setTxt('invDetailAddress', inv.Client ? inv.Client.address : '-');

    const candidateName = inv.Placement?.Candidate?.fullName || 'Ứng viên';
    const jobTitle = inv.Placement?.Job?.title || 'Chuyên viên';
    setTxt('invDetailPlacementInfo', `${candidateName} - ${jobTitle}`);

    setTxt('invDetailSubtotal', formatMoney(inv.subtotal));
    setTxt('invDetailSubtotalFoot', formatMoney(inv.subtotal));
    setTxt('invDetailVat', formatMoney(inv.vatAmount));
    setTxt('invDetailTotal', formatMoney(inv.totalAmount));
    setTxt('invDetailPaid', formatMoney(inv.paidAmount));
    setTxt('invDetailRemaining', formatMoney(inv.remainingAmount));

    let badgeClass = 'badge-sent';
    if (inv.status === 'Paid') badgeClass = 'badge-paid';
    if (inv.status === 'Partial') badgeClass = 'badge-partial';
    if (inv.status === 'Overdue') badgeClass = 'badge-overdue';

    const statusBadgeEl = document.getElementById('invDetailStatusBadge');
    if (statusBadgeEl) {
      statusBadgeEl.innerHTML = `<span class="status-badge ${badgeClass}">${inv.status}</span>`;
    }

    const modalEl = document.getElementById('modalInvoiceDetail');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    } else {
      alert('Chi tiết HĐ ' + inv.invoiceCode + ' | Còn nợ: ' + formatMoney(inv.remainingAmount));
    }
  } catch (err) {
    console.error('Lỗi xem chi tiết hóa đơn:', err);
    alert('Không thể mở chi tiết hóa đơn!');
  }
}

async function exportInvoicesCSV() {
  try {
    const res = await fetch('/api/invoices');
    const data = await res.json();
    let csv = 'Mã Hóa Đơn,Khách Hàng,Tổng Tiền,Đã Trả,Còn Nợ,Hạn Trả,Trạng Thái\n';
    (data.invoices || []).forEach(i => {
      csv += `"${i.invoiceCode}","${i.Client?.companyName || ''}","${i.totalAmount}","${i.paidAmount}","${i.remainingAmount}","${i.dueDate}","${i.status}"\n`;
    });
    downloadCSV(csv, 'Danh_Sach_Hoa_Don.csv');
  } catch (err) {
    alert('Lỗi xuất CSV!');
  }
}