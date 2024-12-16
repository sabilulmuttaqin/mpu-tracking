<?php
// Koneksi ke database
$host = "localhost";
$user = "root";
$password = "";
$database = "prakpiranti6";

$conn = new mysqli($host, $user, $password, $database);

// Cek koneksi
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Ambil data dari request GET atau POST dengan validasi
$ax = isset($_GET['ax']) ? $_GET['ax'] : (isset($_POST['ax']) ? $_POST['ax'] : null);
$ay = isset($_GET['ay']) ? $_GET['ay'] : (isset($_POST['ay']) ? $_POST['ay'] : null);
$az = isset($_GET['az']) ? $_GET['az'] : (isset($_POST['az']) ? $_POST['az'] : null);
$status = isset($_GET['status']) ? $_GET['status'] : (isset($_POST['status']) ? $_POST['status'] : null);

// Pastikan semua data tersedia
if ($ax !== null && $ay !== null && $az !== null && $status !== null) {
  // Simpan ke database
  $sql = "INSERT INTO sensor_data (ax, ay, az, status) VALUES ('$ax', '$ay', '$az', '$status')";

  if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
} else {
  echo "Invalid data: All fields (ax, ay, az, status) are required.";
}

$conn->close();
