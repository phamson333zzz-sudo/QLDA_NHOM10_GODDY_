/**
 * Module: Dashboard & Thống Kê KPI
 */
async function loadDashboard() {
  try {
    const res = await fetch('/api/dashboard/stats');
    const data = await res.json();
    if (data.success) {
      const vRevenue = document.getElementById('valTotalRevenue');
      if (vRevenue) vRevenue.textContent = formatMoney(data.stats.totalRevenue);
      const vAR = document.getElementById('valTotalAR');
      if (vAR) vAR.textContent = formatMoney(data.stats.totalAR);
      const vOverdue = document.getElementById('valOverdueAR');
      if (vOverdue) vOverdue.textContent = formatMoney(data.stats.overdueAR);
      const vPlacement = document.getElementById('valPlacementCount');
      if (vPlacement) vPlacement.textContent = data.stats.placementCount + ' Deals';
      const vColRate = document.getElementById('valCollectionRate');
      if (vColRate) vColRate.textContent = data.stats.collectionRate + '%';
      const vBadDebt = document.getElementById('valBadDebtRate');
      if (vBadDebt) vBadDebt.textContent = data.stats.badDebtRate + '%';

      if (data.chartData) {
        initCharts(data.chartData);
      }

      // Render Top 5 Debtors
      const tbody = document.getElementById('topDebtorsTableBody');
      if (tbody) {
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
    }
  } catch (err) {
    console.error('Lỗi tải Dashboard:', err);
  }
}

function initCharts(chartData) {
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }
  if (industryChartInstance) {
    industryChartInstance.destroy();
    industryChartInstance = null;
  }

  const canvasRev = document.getElementById('revenueChart');
  if (canvasRev && typeof Chart !== 'undefined') {
    const ctxRev = canvasRev.getContext('2d');
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
  }

  const canvasInd = document.getElementById('industryChart');
  if (canvasInd && typeof Chart !== 'undefined') {
    const ctxInd = canvasInd.getContext('2d');
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
}