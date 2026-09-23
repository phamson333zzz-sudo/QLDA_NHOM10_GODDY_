/**
 * Module: Quản Lý Khách Hàng Doanh Nghiệp (B2B)
 */
    async function loadClients() {
      const res = await fetch('/api/clients');
      const data = await res.json();
      globalClients = data.clients || [];
      renderClientsTable(globalClients);
    }

    function renderClientsTable(clients) {
      const tbody = document.getElementById('clientsTableBody');
      tbody.innerHTML = '';
      if (!clients || clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Không có khách hàng nào.</td></tr>';
        return;
      }
      clients.forEach(c => {
        tbody.innerHTML += `
          <tr>
            <td>
              <strong>${c.companyName}</strong><br>
              <small class="text-muted">${c.address || 'Chưa cập nhật'}</small>
            </td>
            <td><code>${c.taxCode}</code></td>
            <td>${c.contactPerson || '-'}</td>
            <td>
              <small>${c.contactEmail || '-'}</small><br>
              <small class="text-muted">${c.contactPhone || ''}</small>
            </td>
            <td><span class="badge bg-secondary">Net ${c.paymentTermDays} ngày</span></td>
            <td><span class="status-badge badge-paid">${c.status}</span></td>
          </tr>
        `;
      });
    }

    function filterClientsTable() {
      const q = document.getElementById('clientSearchInput').value.toLowerCase();
      const filtered = globalClients.filter(c =>
        c.companyName.toLowerCase().includes(q) ||
        c.taxCode.toLowerCase().includes(q) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
      );
      renderClientsTable(filtered);
    }

    function openModalAddClient() {
      document.getElementById('formAddClient').reset();
      new bootstrap.Modal(document.getElementById('modalAddClient')).show();
    }

    async function submitAddClient(e) {
      e.preventDefault();
      const body = {
        companyName: document.getElementById('newClientName').value,
        taxCode: document.getElementById('newClientTaxCode').value,
        paymentTermDays: document.getElementById('newClientNetDays').value,
        address: document.getElementById('newClientAddress').value,
        contactPerson: document.getElementById('newClientContactPerson').value,
        contactPhone: document.getElementById('newClientContactPhone').value,
        contactEmail: document.getElementById('newClientContactEmail').value
      };

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('modalAddClient')).hide();
        alert('Thêm khách hàng doanh nghiệp thành công!');
        loadClients();
      } else {
        alert(data.message || 'Có lỗi xảy ra!');
      }
    }


    function exportClientsCSV() {
      if (!globalClients.length) return alert('Không có dữ liệu!');
      let csv = 'ID,Doanh Nghiệp,Mã Số Thuế,Địa Chỉ,Người Liên Hệ,Email,Điện Thoại,NetDays\n';
      globalClients.forEach(c => {
        csv += `"${c.id}","${c.companyName}","${c.taxCode}","${c.address || ''}","${c.contactPerson || ''}","${c.contactEmail || ''}","${c.contactPhone || ''}","${c.paymentTermDays}"\n`;
      });
      downloadCSV(csv, 'Danh_Sach_Khach_Hang_B2B.csv');
    }