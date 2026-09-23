/**
 * Module: Quản Lý Hóa Đơn & In Ấn (Invoicing)
 */
    async function loadInvoices() {
      const status = document.getElementById('invoiceFilterStatus').value;
      const url = status === 'All' ? '/api/invoices' : `/api/invoices?status=${status}`;
      const res = await fetch(url);
      const data = await res.json();
      const tbody = document.getElementById('invoicesTableBody');
      tbody.innerHTML = '';
      if (!data.invoices || data.invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Không có hóa đơn nào.</td></tr>';
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
    }

    async function viewInvoiceDetail(invoiceId) {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      const data = await res.json();
      if (!data.success || !data.invoice) return alert('Không tìm thấy thông tin hóa đơn!');
      const inv = data.invoice;

      document.getElementById('invDetailCode').textContent = inv.invoiceCode;
      document.getElementById('invDetailIssueDate').textContent = inv.issueDate;
      document.getElementById('invDetailDueDate').textContent = inv.dueDate;
      document.getElementById('invDetailClientName').textContent = inv.Client ? inv.Client.companyName : '-';
      document.getElementById('invDetailTaxCode').textContent = inv.Client ? inv.Client.taxCode : '-';
      document.getElementById('invDetailAddress').textContent = inv.Client ? inv.Client.address : '-';

      const candidateName = inv.Placement?.Candidate?.fullName || 'Ứng viên';
      const jobTitle = inv.Placement?.Job?.title || 'Chuyên viên';
      document.getElementById('invDetailPlacementInfo').textContent = `${candidateName} - ${jobTitle}`;

      document.getElementById('invDetailSubtotal').textContent = formatMoney(inv.subtotal);
      document.getElementById('invDetailSubtotalFoot').textContent = formatMoney(inv.subtotal);
      document.getElementById('invDetailVat').textContent = formatMoney(inv.vatAmount);
      document.getElementById('invDetailTotal').textContent = formatMoney(inv.totalAmount);
      document.getElementById('invDetailPaid').textContent = formatMoney(inv.paidAmount);
      document.getElementById('invDetailRemaining').textContent = formatMoney(inv.remainingAmount);

      let badgeClass = 'badge-sent';
      if (inv.status === 'Paid') badgeClass = 'badge-paid';
      if (inv.status === 'Partial') badgeClass = 'badge-partial';
      if (inv.status === 'Overdue') badgeClass = 'badge-overdue';
      document.getElementById('invDetailStatusBadge').innerHTML = `<span class="status-badge ${badgeClass}">${inv.status}</span>`;

      new bootstrap.Modal(document.getElementById('modalInvoiceDetail')).show();
    }


    async function exportInvoicesCSV() {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      let csv = 'Mã Hóa Đơn,Khách Hàng,Tổng Tiền,Đã Trả,Còn Nợ,Hạn Trả,Trạng Thái\n';
      (data.invoices || []).forEach(i => {
        csv += `"${i.invoiceCode}","${i.Client?.companyName || ''}","${i.totalAmount}","${i.paidAmount}","${i.remainingAmount}","${i.dueDate}","${i.status}"\n`;
      });
      downloadCSV(csv, 'Danh_Sach_Hoa_Don.csv');
    }