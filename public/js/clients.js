/**
 * Module: Quản Lý Khách Hàng Doanh Nghiệp (B2B)
 */
async function loadClients() {
  try {
    const res = await fetch('/api/clients');
    const data = await res.json();
    globalClients = data.clients || [];
    renderClientsTable(globalClients);
  } catch (err) {
    console.error('Lỗi tải danh sách khách hàng:', err);
  }
}

function renderClientsTable(clients) {
  const tbody = document.getElementById('clientsTableBody');
  if (!tbody) return;

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
  const inputEl = document.getElementById('clientSearchInput');
  const q = inputEl ? inputEl.value.toLowerCase() : '';
  const filtered = globalClients.filter(c =>
    (c.companyName && c.companyName.toLowerCase().includes(q)) ||
    (c.taxCode && c.taxCode.toLowerCase().includes(q)) ||
    (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
  );
  renderClientsTable(filtered);
}

function openModalAddClient() {
  const form = document.getElementById('formAddClient');
  if (form) form.reset();
  const modalEl = document.getElementById('modalAddClient');
  if (modalEl) {
    new bootstrap.Modal(modalEl).show();
  } else {
    alert('Không tìm thấy hộp thoại thêm khách hàng!');
  }
}

async function submitAddClient(e) {
  e.preventDefault();
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  };

  const body = {
    companyName: getVal('newClientName'),
    taxCode: getVal('newClientTaxCode'),
    paymentTermDays: getVal('newClientNetDays'),
    address: getVal('newClientAddress'),
    contactPerson: getVal('newClientContactPerson'),
    contactPhone: getVal('newClientContactPhone'),
    contactEmail: getVal('newClientContactEmail')
  };

  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      const modalEl = document.getElementById('modalAddClient');
      if (modalEl) {
        const modalInst = bootstrap.Modal.getInstance(modalEl);
        if (modalInst) modalInst.hide();
      }
      alert('Thêm khách hàng doanh nghiệp thành công!');
      loadClients();
    } else {
      alert(data.message || 'Có lỗi xảy ra!');
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!');
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