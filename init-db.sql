CREATE DATABASE ansorkujorowesi;

USE ansorkujorowesi;

-- Tabel Admin
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Tabel Anggota
CREATE TABLE members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(50),
  status_keanggotaan ENUM('Aktif', 'Alumni', 'Kehormatan') DEFAULT 'Aktif'
);

-- Tabel Kegiatan
CREATE TABLE activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul_kegiatan VARCHAR(255) NOT NULL,
  tanggal_pelaksanaan DATE,
  lokasi VARCHAR(255)
);

