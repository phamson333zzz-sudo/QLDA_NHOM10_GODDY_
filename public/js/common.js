/**
 * GODDY RECRUIT - Common & Global Logic
 */
    let globalClients = [];
    let globalJobs = [];
    let globalCandidates = [];
    let revenueChartInstance = null;
    let industryChartInstance = null;

    let currentUserRole = 'admin'; // 'admin', 'accountant', 'recruiter', 'client'
    let currentClientId = 1;
    let currentUser = {
      username: 'admin',
      fullName: 'Huỳnh Nguyễn Vĩnh Phúc',
      role: 'admin'
    };

    // Chuyển Tab
    function switchTab(tabKey) {
      if (currentUserRole === 'client') {
        switchUserRole('admin');
        return;
      }
      const sections = ['dashboard', 'clients', 'recruitment', 'invoices', 'debt', 'audit', 'client-portal'];
      sections.forEach(s => {
        const el = document.getElementById('section-' + s);
        if (el) el.style.display = (s === tabKey) ? 'block' : 'none';
      });

      document.querySelectorAll('#sidebarMenuInternal .sidebar-item').forEach(item => item.classList.remove('active'));
      const activeItem = Array.from(document.querySelectorAll('#sidebarMenuInternal .sidebar-item')).find(el => el.getAttribute('onclick')?.includes(tabKey));
      if (activeItem) activeItem.classList.add('active');

      const titles = {
        'dashboard': 'Dashboard Dữ Liệu Tuyển Dụng & Tài Chính',
        'clients': 'Quản Lý Khách Hàng Doanh Nghiệp (B2B)',
        'recruitment': 'Quản Lý Deal Tuyển Dụng & Thời Hạn Bảo Hành',
        'invoices': 'Quản Lý Hóa Đơn Dịch Vụ Tuyển Dụng',
        'debt': 'Báo Cáo Công Nợ & Phân Tích Tuổi Nợ (Aging Report)',
        'audit': 'Nhật Ký Thao Tác Hệ Thống (Audit Trail)'
      };
      document.getElementById('pageHeaderTitle').textContent = titles[tabKey] || 'GODDY RECRUIT';

      if (tabKey === 'dashboard') loadDashboard();
      if (tabKey === 'clients') loadClients();
      if (tabKey === 'recruitment') loadPlacements();
      if (tabKey === 'invoices') loadInvoices();
      if (tabKey === 'debt') loadDebt();
      if (tabKey === 'audit') loadAudit();
    }

    function reloadCurrentTab() {
      if (currentUserRole === 'client') {
        loadClientPortal(currentClientId);
      } else {
        const activeItem = document.querySelector('#sidebarMenuInternal .sidebar-item.active');
        if (activeItem) activeItem.click();
      }
    }

    function formatMoney(amount) {
      return (parseFloat(amount) || 0).toLocaleString('vi-VN') + ' đ';
    }

    // ================= DASHBOARD =================

    function downloadCSV(csv, filename) {
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    // ================= CLIENT PORTAL & ROLE SWITCHER LOGIC =================
    function switchUserRole(role, clientId = 1) {
      currentUserRole = role;
      currentClientId = clientId;

      const roleBadge = document.getElementById('roleBadge');
      const navRoleTitle = document.getElementById('navRoleTitle');
      const sidebarMenuInternal = document.getElementById('sidebarMenuInternal');
      const sidebarMenuClient = document.getElementById('sidebarMenuClient');
      const sidebarFooterInternal = document.getElementById('sidebarFooterInternal');
      const sidebarFooterClient = document.getElementById('sidebarFooterClient');
      const sidebarLogoIcon = document.getElementById('sidebarLogoIcon');
      const sidebarMainTitle = document.getElementById('sidebarMainTitle');
      const sidebarSubTitle = document.getElementById('sidebarSubTitle');

      if (role === 'client') {
        sidebarMenuInternal.style.display = 'none';
        sidebarMenuClient.style.display = 'block';
        sidebarFooterInternal.style.display = 'none';
        sidebarFooterClient.style.display = 'block';

        sidebarLogoIcon.innerHTML = '<i class="fa-solid fa-building"></i>';
        sidebarMainTitle.textContent = 'CỔNG KHÁCH HÀNG';

        roleBadge.className = 'badge bg-primary rounded-pill px-2 py-1';
        roleBadge.textContent = 'Khách hàng B2B';

        const clientNames = {
          1: 'FPT Software (Trần Thu Hà)',
          2: 'VNG Corporation (Nguyễn Hoàng Long)',
          3: 'Shopee Việt Nam (Lê Thùy Dương)'
        };
        const cName = clientNames[clientId] || 'Doanh Nghiệp Đối Tác';
        navRoleTitle.textContent = cName;
        sidebarSubTitle.textContent = cName.split('(')[0].trim();

        // Ẩn tất cả section nội bộ, hiện section client portal
        const sections = ['dashboard', 'clients', 'recruitment', 'invoices', 'debt', 'audit'];
        sections.forEach(s => {
          const el = document.getElementById('section-' + s);
          if (el) el.style.display = 'none';
        });
        document.getElementById('section-client-portal').style.display = 'block';
        document.getElementById('pageHeaderTitle').textContent = `Cổng Thông Tin Doanh Nghiệp - ${sidebarSubTitle.textContent}`;

        switchClientSubTab('invoices');
        loadClientPortal(clientId);
      } else {
        sidebarMenuInternal.style.display = 'block';
        sidebarMenuClient.style.display = 'none';
        sidebarFooterInternal.style.display = 'block';
        sidebarFooterClient.style.display = 'none';

        sidebarLogoIcon.innerHTML = '<i class="fa-solid fa-chart-pie"></i>';
        sidebarMainTitle.textContent = 'GODDY RECRUIT';
        sidebarSubTitle.textContent = 'Quản Lý Công Nợ B2B';

        document.getElementById('section-client-portal').style.display = 'none';

        if (role === 'admin') {
          roleBadge.className = 'badge bg-danger rounded-pill px-2 py-1';
          roleBadge.textContent = 'Admin';
          navRoleTitle.textContent = 'Huỳnh Nguyễn Vĩnh Phúc';
        } else if (role === 'accountant') {
          roleBadge.className = 'badge bg-success rounded-pill px-2 py-1';
          roleBadge.textContent = 'Kế toán';
          navRoleTitle.textContent = 'Phạm Sơn (Kế toán trưởng)';
        } else if (role === 'recruiter') {
          roleBadge.className = 'badge bg-warning text-dark rounded-pill px-2 py-1';
          roleBadge.textContent = 'Recruiter';
          navRoleTitle.textContent = 'Nguyễn Văn Minh (Senior)';
        }

        switchTab('dashboard');
      }
    }


    function openLoginModal() {
      new bootstrap.Modal(document.getElementById('modalLogin')).show();
    }

    function quickFillLogin(username, password) {
      document.getElementById('loginUsername').value = username;
      document.getElementById('loginPassword').value = password;
    }

    async function submitLogin(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();
          alert(`Đăng nhập thành công với vai trò: ${data.user.role.toUpperCase()}`);
          if (data.user.role === 'client') {
            switchUserRole('client', data.user.clientId || 1);
          } else {
            switchUserRole(data.user.role);
          }
        } else {
          alert(data.message || 'Đăng nhập thất bại!');
        }
      } catch (err) {
        alert('Lỗi kết nối máy chủ!');
      }
    }

    // Khởi tạo Dashboard hoặc Cổng Khách Hàng khi trang load xong
    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      const clientParam = parseInt(urlParams.get('clientId')) || 1;

      if (roleParam === 'client') {
        switchUserRole('client', clientParam);
      } else if (roleParam === 'accountant' || roleParam === 'ketoan') {
        switchUserRole('accountant');
      } else if (roleParam === 'recruiter') {
        switchUserRole('recruiter');
      } else {
        loadDashboard();
      }
    });