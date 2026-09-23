/**
 * Module: Quản Lý Công Nợ & Báo Cáo Tuổi Nợ (Aging Report)
 */
async function loadDebt() {
  try {
    const res = await fetch('/api/debt/overview');
    const data = await res.json();
    if (data.summary) {
      const a1 = document.getElementById('debtAging1to30');
      if (a1) a1.textContent = formatMoney(data.summary.aging0to30);
      const a2 = document.getElementById('debtAging31to60');
      if (a2) a2.textContent = formatMoney(data.summary.aging31to60);
      const a3 = document.getElementById('debtAgingAbove60');
      if (a3) a3.textContent = formatMoney(data.summary.agingAbove60);
    }

    const tbody = document.getElementById('debtTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!data.debtList || data.debtList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">Hiện không có công nợ cần thu!</td></tr>';
      return;
    }
    data.debtList.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${item.invoiceCode}</strong></td>
          <td>${item.Client ? item.Client.companyName : '-'}</td>
          <td class="text-danger fw-bold">${formatMoney(item.remainingAmount)}</td>
          <td>${item.dueDate}</td>
          <td>
            <span class="badge ${item.overdueDays > 0 ? 'bg-danger' : 'bg-success'}">
              ${item.overdueDays > 0 ? item.overdueDays + ' ngày quá hạn' : 'Trong hạn'}
            </span>
          </td>
          <td><strong>${item.agingCategory}</strong></td>
          <td>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-success" onclick="openRecordPayment(${item.id}, '${item.invoiceCode}', ${item.remainingAmount})">
                <i class="fa-solid fa-hand-holding-dollar me-1"></i>Thu Tiền
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="sendDebtReminder(${item.id})">
                <i class="fa-solid fa-bell me-1"></i>Nhắc Nợ
              </button>
            </div>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Lỗi tải Báo cáo Công Nợ:', err);
  }
}

function openRecordPayment(invId, invCode, remaining) {
  const invIdEl = document.getElementById('payInvoiceId');
  const invCodeEl = document.getElementById('payInvoiceCode');
  const remTextEl = document.getElementById('payRemainingText');
  const amountEl = document.getElementById('payAmount');
  if (invIdEl) invIdEl.value = invId;
  if (invCodeEl) invCodeEl.value = invCode;
  if (remTextEl) remTextEl.value = formatMoney(remaining);
  if (amountEl) {
    amountEl.value = remaining;
    amountEl.max = remaining;
  }
  const modalEl = document.getElementById('modalRecordPayment');
  if (modalEl) {
    new bootstrap.Modal(modalEl).show();
  } else {
    alert('Không tìm thấy hộp thoại ghi nhận thanh toán!');
  }
}

async function submitRecordPayment(e) {
  e.preventDefault();
  const invIdEl = document.getElementById('payInvoiceId');
  const amountEl = document.getElementById('payAmount');
  const methodEl = document.getElementById('payMethod');
  const refEl = document.getElementById('payRefCode');
  const notesEl = document.getElementById('payNotes');

  const body = {
    invoiceId: invIdEl ? invIdEl.value : null,
    amount: amountEl ? amountEl.value : 0,
    paymentMethod: methodEl ? methodEl.value : 'Chuyển khoản',
    referenceCode: refEl ? refEl.value : '',
    notes: notesEl ? notesEl.value : ''
  };

  try {
    const res = await fetch('/api/debt/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      const modalEl = document.getElementById('modalRecordPayment');
      if (modalEl) {
        const modalInst = bootstrap.Modal.getInstance(modalEl);
        if (modalInst) modalInst.hide();
      }
      alert('Ghi nhận thanh toán thành công!');
      loadDebt();
    } else {
      alert(data.message || 'Lỗi khi thu tiền!');
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!');
  }
}

async function sendDebtReminder(invoiceId) {
  try {
    const res = await fetch('/api/debt/remind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId })
    });
    const data = await res.json();
    alert(data.message || 'Đã gửi lời nhắc nợ thành công!');
  } catch (err) {
    alert('Lỗi gửi nhắc nợ!');
  }
}

async function exportDebtCSV() {
  try {
    const res = await fetch('/api/debt/overview');
    const data = await res.json();
    let csv = 'Mã Hóa Đơn,Khách Hàng,Số Tiền Nợ,Hạn Trả,Số Ngày Quá Hạn,Phân Loại Tuổi Nợ\n';
    (data.debtList || []).forEach(d => {
      csv += `"${d.invoiceCode}","${d.Client?.companyName || ''}","${d.remainingAmount}","${d.dueDate}","${d.overdueDays}","${d.agingCategory}"\n`;
    });
    downloadCSV(csv, 'Bao_Cao_Tuoi_No_Aging_Report.csv');
  } catch (err) {
    alert('Lỗi xuất CSV!');
  }
}