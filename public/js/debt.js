/**
 * Module: Quản Lý Công Nợ & Báo Cáo Tuổi Nợ (Aging Report)
 */
    async function loadDebt() {
      const res = await fetch('/api/debt/overview');
      const data = await res.json();
      document.getElementById('debtAging1to30').textContent = formatMoney(data.summary.aging0to30);
      document.getElementById('debtAging31to60').textContent = formatMoney(data.summary.aging31to60);
      document.getElementById('debtAgingAbove60').textContent = formatMoney(data.summary.agingAbove60);

      const tbody = document.getElementById('debtTableBody');
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
    }

    function openRecordPayment(invId, invCode, remaining) {
      document.getElementById('payInvoiceId').value = invId;
      document.getElementById('payInvoiceCode').value = invCode;
      document.getElementById('payRemainingText').value = formatMoney(remaining);
      document.getElementById('payAmount').value = remaining;
      document.getElementById('payAmount').max = remaining;
      new bootstrap.Modal(document.getElementById('modalRecordPayment')).show();
    }

    async function submitRecordPayment(e) {
      e.preventDefault();
      const body = {
        invoiceId: document.getElementById('payInvoiceId').value,
        amount: document.getElementById('payAmount').value,
        paymentMethod: document.getElementById('payMethod').value,
        referenceCode: document.getElementById('payRefCode').value,
        notes: document.getElementById('payNotes').value
      };

      const res = await fetch('/api/debt/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('modalRecordPayment')).hide();
        alert('Ghi nhận thanh toán thành công!');
        loadDebt();
      } else {
        alert(data.message || 'Lỗi khi thu tiền!');
      }
    }

    async function sendDebtReminder(invoiceId) {
      const res = await fetch('/api/debt/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      const data = await res.json();
      alert(data.message || 'Đã gửi lời nhắc nợ thành công!');
    }


    async function exportDebtCSV() {
      const res = await fetch('/api/debt/overview');
      const data = await res.json();
      let csv = 'Mã Hóa Đơn,Khách Hàng,Số Tiền Nợ,Hạn Trả,Số Ngày Quá Hạn,Phân Loại Tuổi Nợ\n';
      (data.debtList || []).forEach(d => {
        csv += `"${d.invoiceCode}","${d.Client?.companyName || ''}","${d.remainingAmount}","${d.dueDate}","${d.overdueDays}","${d.agingCategory}"\n`;
      });
      downloadCSV(csv, 'Bao_Cao_Tuoi_No_Aging_Report.csv');
    }