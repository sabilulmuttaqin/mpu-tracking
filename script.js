let currentPage = 1;
const rowsPerPage = 10;
let allData = [];
let previousData = { ax: null, ay: null, az: null }; // Untuk mendeteksi perubahan data

// Inisialisasi grafik menggunakan Chart.js
const ctx = document.getElementById("realtimeChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Label waktu
    datasets: [
      {
        label: "X",
        backgroundColor: "red",
        borderColor: "red",
        data: [], // Data untuk ax
        fill: false,
      },
      {
        label: "Y",
        borderColor: "green",
        backgroundColor: "green",
        data: [], // Data untuk ay
        fill: false,
      },
      {
        label: "Z",
        borderColor: "blue",
        backgroundColor: "blue",
        data: [], // Data untuk az
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  },
});

/**
 * Fungsi untuk mengambil data dari API
 */
async function fetchData() {
  try {
    const response = await fetch(
      "http://192.168.244.107/pirantimod6/get_sensor.php"
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    allData = await response.json();
    updateHighlight();
    updateTable();
    updateChart(); // Tambahkan data ke grafik
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

/**
 * Fungsi untuk memperbarui grafik real-time
 */
function updateChart() {
  if (allData.length > 0) {
    const latestData = allData[0]; // Ambil data terbaru

    // Perbarui data lama
    previousData = { ax: latestData.ax, ay: latestData.ay, az: latestData.az };

    // Tambahkan data baru ke grafik
    const timestamp = latestData.timestamp || new Date().toLocaleTimeString();
    chart.data.labels.push(timestamp);
    chart.data.datasets[0].data.push(parseFloat(latestData.ax) || 0); // ax
    chart.data.datasets[1].data.push(parseFloat(latestData.ay) || 0); // ay
    chart.data.datasets[2].data.push(parseFloat(latestData.az) || 0); // az

    // Batasi jumlah data di grafik (misalnya 10)
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets.forEach((dataset) => dataset.data.shift());
    }

    chart.update();
  }
}

/**
 * Fungsi untuk memperbarui highlight (data terbaru)
 */
function updateHighlight() {
  if (allData.length > 0) {
    const latestData = allData[0];
    document.getElementById("highlight-ax").textContent =
      latestData.ax || "N/A";
    document.getElementById("highlight-ay").textContent =
      latestData.ay || "N/A";
    document.getElementById("highlight-az").textContent =
      latestData.az || "N/A";
    document.getElementById("highlight-status").textContent =
      latestData.status || "N/A";
    document.getElementById("highlight-timestamp").textContent =
      latestData.timestamp || "N/A";
  }
}

/**
 * Fungsi untuk memperbarui tabel riwayat
 */
function updateTable() {
  const tableBody = document.getElementById("data-table");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, allData.length);

  for (let i = startIndex; i < endIndex; i++) {
    const row = allData[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.ax || "N/A"}</td>
      <td>${row.ay || "N/A"}</td>
      <td>${row.az || "N/A"}</td>
      <td>${row.status || "N/A"}</td>
      <td>${row.timestamp || "N/A"}</td>
    `;

    tableBody.appendChild(tr);
  }

  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = endIndex >= allData.length;
}

// Jalankan fetchData setiap 1 detik
setInterval(fetchData, 1000);
