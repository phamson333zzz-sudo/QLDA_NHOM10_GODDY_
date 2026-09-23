/**
 * Module: Cổng Thông Tin Khách Hàng Doanh Nghiệp (Client Portal)
 */
    function switchClientSubTab(subTabKey) {
      const subTabs = ['invoices', 'jobs', 'placements', 'profile'];
      subTabs.forEach(t => {
        const tabEl = document.getElementById('clientSubTab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (tabEl) tabEl.style.display = (t === subTabKey) ? 'block' : 'none';
      });

      // Update subnav buttons
      document.querySelectorAll('.client-subnav-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById('btnSubNav' + subTabKey.charAt(0).toUpperCase() + subTabKey.slice(1));
      if (activeBtn) activeBtn.classList.add('active');

      // Update sidebar items in client mode
      document.querySelectorAll('#sidebarMenuClient .sidebar-item').forEach(item => item.classList.remove('active'));
      const activeSidebar = Array.from(document.querySelectorAll('#sidebarMenuClient .sidebar-item')).find(el => el.getAttribute('onclick')?.includes(subTabKey));
      if (activeSidebar) activeSidebar.classList.add('active');
    }

    async function loadClientPortal(clientId) {
      try {
        const res = await fetch(`/api/clients/portal/${clientId}`);
        const data = await res.json();
        if (!data.success || !data.client) {
          alert('Không thể tải dữ liệu cổng khách hàng!');
          return;
        }

        const client = data.client;
        const summary = data.summary;

        // Hero info
        document.getElementById('cpCompanyName').textContent = client.companyName;
        document.getElementById('cpTaxCode').textContent = client.taxCode;
        document.getElementById('cpNetDays').textContent = `Net ${client.paymentTermDays} ngày`;
        document.getElementById('cpStatus').textContent = client.status;
        document.getElementById('cpContactPerson').textContent = client.contactPerson || '-';
        document.getElementById('cpContactEmail').textContent = client.contactEmail || '-';

        // 4 Metric cards
        document.getElementById('cpValRemaining').textContent = formatMoney(summary.totalRemaining);
        document.getElementById('cpValPaid').textContent = formatMoney(summary.totalPaid);
        document.getElementById('cpValActiveJobs').textContent = summary.activeJobs + ' Vị trí';
        document.getElementById('cpValWarranty').textContent = summary.warrantyActive + ' Ứng viên';

        // 1. Table Invoices
        const tbodyInv = document.getElementById('cpInvoicesTableBody');
        tbodyInv.innerHTML = '';
        if (!data.invoices || data.invoices.length === 0) {
          tbodyInv.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Công ty chưa có hóa đơn phát hành nào.</td></tr>';
        } else {
          data.invoices.forEach(inv => {
            let badgeClass = 'badge-sent';
            let statusText = 'Chờ thanh toán';
            if (inv.status === 'Paid') { badgeClass = 'badge-paid'; statusText = 'Đã thanh toán'; }
            else if (inv.status === 'Partial') { badgeClass = 'badge-partial'; statusText = 'Đã trả một phần'; }
            else if (inv.status === 'Overdue' || inv.overdueDays > 0) { badgeClass = 'badge-overdue'; statusText = `${inv.overdueDays} ngày quá hạn`; }

            tbodyInv.innerHTML += `
              <tr>
                <td><strong>${inv.invoiceCode}</strong></td>
                <td>${inv.issueDate}</td>
                <td>${inv.dueDate}</td>
                <td class="fw-bold">${formatMoney(inv.totalAmount)}</td>
                <td class="text-success">${formatMoney(inv.paidAmount)}</td>
                <td class="text-danger fw-bold">${formatMoney(inv.remainingAmount)}</td>
                <td><span class="status-badge ${badgeClass}">${statusText}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" onclick="viewInvoiceDetail(${inv.id})">
                    <i class="fa-solid fa-file-lines me-1"></i>Xem & In
                  </button>
                </td>
              </tr>
            `;
          });
        }

        // 2. Table Jobs
        const tbodyJobs = document.getElementById('cpJobsTableBody');
        tbodyJobs.innerHTML = '';
        if (!data.jobs || data.jobs.length === 0) {
          tbodyJobs.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Chưa có vị trí tuyển dụng nào được đặt hàng.</td></tr>';
        } else {
          data.jobs.forEach(job => {
            const isOpen = job.status === 'Opening';
            tbodyJobs.innerHTML += `
              <tr>
                <td>#${job.id}</td>
                <td><strong class="text-primary">${job.title}</strong></td>
                <td>${job.department || 'Bộ phận Kỹ thuật'}</td>
                <td>${job.salaryRange}</td>
                <td>${job.feeRatePercent}%</td>
                <td>
                  <span class="badge ${isOpen ? 'bg-success' : 'bg-secondary'}">
                    ${isOpen ? 'Đang Tuyển (Opening)' : 'Đã Đóng (Closed)'}
                  </span>
                </td>
              </tr>
            `;
          });
        }

        // 3. Table Placements
        const tbodyPlacements = document.getElementById('cpPlacementsTableBody');
        tbodyPlacements.innerHTML = '';
        if (!data.placements || data.placements.length === 0) {
          tbodyPlacements.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">Chưa có ứng viên nào onboard cho công ty.</td></tr>';
        } else {
          data.placements.forEach(p => {
            const isWarranty = p.status === 'UnderWarranty';
            tbodyPlacements.innerHTML += `
              <tr>
                <td><strong>${p.Candidate ? p.Candidate.fullName : 'Ứng viên'}</strong><div class="text-muted small">${p.Candidate?.email || ''}</div></td>
                <td>${p.Job ? p.Job.title : '-'}</td>
                <td class="fw-bold">${formatMoney(p.officialSalary)}</td>
                <td>${p.onboardDate}</td>
                <td><span class="badge bg-light text-dark border">${p.warrantyDays} ngày</span></td>
                <td>${p.warrantyEndDate || '-'}</td>
                <td>
                  <span class="badge ${isWarranty ? 'bg-warning text-dark' : 'bg-success'}">
                    <i class="fa-solid ${isWarranty ? 'fa-clock' : 'fa-check'} me-1"></i>
                    ${isWarranty ? 'Đang Bảo Hành' : 'Hoàn Thành'}
                  </span>
                </td>
              </tr>
            `;
          });
        }

        // 4. Profile
        document.getElementById('cpProfName').textContent = client.companyName;
        document.getElementById('cpProfTaxCode').textContent = client.taxCode;
        document.getElementById('cpProfAddress').textContent = client.address || 'Chưa cập nhật';
        document.getElementById('cpProfPerson').textContent = client.contactPerson || '-';
        document.getElementById('cpProfEmail').textContent = client.contactEmail || '-';
        document.getElementById('cpProfPhone').textContent = client.contactPhone || '-';
        document.getElementById('cpProfNetDays').textContent = `Net ${client.paymentTermDays} ngày kể từ ngày xuất HĐ VAT`;
        document.getElementById('cpProfStatus').textContent = `${client.status} (Hợp đồng nguyên tắc có hiệu lực)`;

      } catch (err) {
        console.error('Lỗi tải Cổng khách hàng:', err);
      }
    }

    function openClientRequestJobModal() {
      document.getElementById('formClientRequestJob').reset();
      new bootstrap.Modal(document.getElementById('modalClientRequestJob')).show();
    }

    async function submitClientRequestJob(e) {
      e.preventDefault();
      const body = {
        clientId: currentClientId,
        title: document.getElementById('cpJobTitle').value,
        department: document.getElementById('cpJobDepartment').value,
        salaryRange: document.getElementById('cpJobSalary').value || 'Thỏa thuận',
        feeRatePercent: 18.0
      };

      try {
        const res = await fetch('/api/recruitment/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          bootstrap.Modal.getInstance(document.getElementById('modalClientRequestJob')).hide();
          alert('Gửi yêu cầu tuyển dụng mới thành công! GODDY Recruit đã tiếp nhận và sẽ sớm liên hệ.');
          loadClientPortal(currentClientId);
        } else {
          alert(data.message || 'Lỗi gửi yêu cầu!');
        }
      } catch (err) {
        alert('Lỗi kết nối máy chủ!');
      }
    }