/**
 * Module: Nhật Ký Kiểm Toán Hệ Thống (Audit Logs)
 */
async function loadAudit() {
  try {
    const res = await fetch('/api/audit');
    const data = await res.json();
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!data.logs || data.logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Chưa có nhật ký nào.</td></tr>';
      return;
    }
    data.logs.forEach(l => {
      const time = new Date(l.createdAt).toLocaleTimeString('vi-VN') + ' ' + new Date(l.createdAt).toLocaleDateString('vi-VN');
      tbody.innerHTML += `
        <tr>
          <td class="text-muted"><small>${time}</small></td>
          <td><span class="badge bg-dark">${l.action}</span></td>
          <td><span class="badge bg-secondary">${l.module}</span></td>
          <td>${l.details}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Lỗi tải nhật ký kiểm toán:', err);
  }
}