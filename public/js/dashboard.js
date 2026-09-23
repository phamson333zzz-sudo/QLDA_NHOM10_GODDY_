/**
 * Module: Dashboard & Thống Kê KPI
 */
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success) {
          document.getElementById('valTotalRevenue').textContent = formatMoney(data.stats.totalRevenue);
          document.getElementById('valTotalAR').textContent = formatMoney(data.stats.totalAR);
          document.getElementById('valOverdueAR').textContent = formatMoney(data.stats.overdueAR);
          document.getElementById('valPlacementCount').textContent = data.stats.placementCount + ' Deals';
          document.getElementById('valCollectionRate').textContent = data.stats.collectionRate + '%';
          document.getElementById('valBadDebtRate').textContent = data.stats.badDebtRate + '%';

          initCharts(data.chartData);

          // Render Top 5 Debtors
          const tbody = document.getElementById('topDebtorsTableBody');
          tbody.innerHTML = '';
          if (data.topDebtors && data.topDebtors.length > 0) {
            data.topDebtors.forEach(td => {
              tbody.innerHTML += `
                <tr>
                  <td><strong>${td.companyName}</strong></td>
                  <td><code>${td.taxCode}</code></td>
                  <td><span class="badge bg-secondary">${td.invoiceCount} hóa đơn</span></td>
                  <td class="text-danger fw-bold">${formatMoney(td.totalRemaining)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="switchTab('debt')">
                      <i class="fa-solid fa-eye me-1"></i>Xem Chi Tiết
                    </button>
                  </td>
                </tr>
              `;
            });
          } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Hiện không có công nợ tồn đọng!</td></tr>';
          }
        }
      } catch (err) {
        console.error('Lỗi tải Dashboard:', err);
      }
    }

    function initCharts(chartData) {
      if (revenueChartInstance) revenueChartInstance.destroy();
      if (industryChartInstance) industryChartInstance.destroy();

      const ctxRev = document.getElementById('revenueChart').getContext('2d');
      revenueChartInstance = new Chart(ctxRev, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Doanh thu thực tế (triệu VNĐ)',
            data: chartData.revenueByMonth,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#4f46e5',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: '#f1f5f9' }, ticks: { callback: v => v + ' tr' } },
            x: { grid: { display: false } }
          }
        }
      });

      const ctxInd = document.getElementById('industryChart').getContext('2d');
      industryChartInstance = new Chart(ctxInd, {
        type: 'doughnut',
        data: {
          labels: chartData.industryShare.labels,
          datasets: [{
            data: chartData.industryShare.series,
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#64748b'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } } }
        }
      });
    }
