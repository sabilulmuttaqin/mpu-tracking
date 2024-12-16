<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Konfigurasi koneksi database
$host = "localhost";
$username = "root";
$password = "";
$database = "prakpiranti6";

// Membuat koneksi
$conn = new mysqli($host, $username, $password, $database);

// Periksa koneksi
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Ambil data dari database
$sql = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 50";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

// Output data dalam format JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
