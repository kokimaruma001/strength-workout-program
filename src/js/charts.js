// ─── CHART UTILITIES ────────────────────────────────────────────────────────
let chartInstances = {};

function createBarChart(canvasId, labels, data, label = 'Sessions') {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: '#c8501a',
        borderColor: '#c8501a',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          max: 1,
        },
        x: {
          ticks: {
            color: '#555',
            font: {
              family: "'Courier New', monospace",
              size: 10,
            }
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          }
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}

function createLineChart(canvasId, labels, data, label = 'Total KG') {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: '#c8501a',
        backgroundColor: 'rgba(200, 80, 26, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#c8501a',
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#111',
          borderColor: '#333',
          borderWidth: 1,
          titleColor: '#e8e4dc',
          bodyColor: '#e8e4dc',
          bodyFont: {
            family: "'Courier New', monospace",
            size: 11,
          },
          padding: 8,
        }
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
        },
        x: {
          ticks: {
            color: '#555',
            font: {
              family: "'Courier New', monospace",
              size: 10,
            }
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          }
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}

function destroyAllCharts() {
  Object.values(chartInstances).forEach(chart => {
    if (chart) chart.destroy();
  });
  chartInstances = {};
}
