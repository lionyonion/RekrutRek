# 💼 Job Market & Talent Analytics Dashboard — Indonesia ✨

Selamat datang di **Job Market & Talent Analytics Dashboard**! Ini adalah aplikasi web interaktif premium berbasis **Streamlit** dan **Plotly** yang dirancang sebagai bagian dari *Data Science Capstone Project*. 

Aplikasi ini menyajikan analisis data pasar kerja komprehensif di Indonesia secara dua arah: **Kebutuhan Lowongan Kerja (Demand)** dari sisi perusahaan, serta **Ketersediaan Keahlian Pelamar (Supply)** dari sisi resume kandidat hasil pemrosesan ETL.

---

## 🚀 Fitur Unggulan Dashboard

Dashboard ini dibagi menjadi **6 Tab Premium** dengan visualisasi interaktif yang kaya akan wawasan bisnis:

### 1. 🗺️ Sebaran Lokasi (*Location Analytics*)
* **Distribusi per Provinsi**: Visualisasi grafik batang horizontal premium tentang sebaran lowongan di seluruh wilayah Indonesia (didominasi oleh DKI Jakarta dan Jawa Barat).
* **Proporsi Wilayah**: Donut chart proporsi sebaran lowongan di Pulau Jawa vs luar Jawa.
* **Sebaran Global**: Treemap proporsi lowongan per provinsi untuk melihat kontribusi ekonomi secara visual.

### 2. 💰 Analisis Gaji (*Salary Analytics*)
* **Histogram Gaji**: Grafik distribusi gaji bulanan di Indonesia lengkap dengan garis penanda rata-rata (*mean*) dan nilai tengah (*median*).
* **Kompensasi per Jenis Pekerjaan**: Box plot sebaran gaji berdasarkan kategori kerja (*Penuh Waktu, Kontrak, Magang, dll.*).
* **Perbandingan Wilayah**: Grafik perbandingan median gaji per provinsi terhadap rata-rata nasional untuk membantu penyusunan fitur estimasi gaji.

### 3. 🛠️ Skill & Demand (*Supply vs Demand Matchmaking*)
* **Keahlian Paling Dicari**: Grafik batang *Top Keahlian* yang paling sering tercantum dalam kualifikasi lowongan kerja industri.
* **Heatmap Keterampilan**: Persentase kebutuhan *skill* spesifik per provinsi.
* **👥 Sisi Pelamar (Supply) - BARU!**: Visualisasi perbandingan keahlian yang paling banyak dimiliki oleh kandidat resume berdasarkan hasil ekstraksi kamus keahlian 24 kategori, membantu mendeteksi *skill gaps* di pasar kerja.

### 4. 🏭 Industri & Job Type (*Industry & Sector Analytics*)
* **Top Sektor**: Analisis volume lowongan kerja terbesar per sektor industri (*Retail, IT, Manufaktur, dll.*).
* **Bubble Plot Dinamis**: Memetakan korelasi antara volume industri terhadap median gaji bulanan (ukuran gelembung menggambarkan kapasitas industri).

### 5. 📋 Eksplorasi Data Lowongan (*Job Explorer*)
* **Pencarian Cerdas**: Tabel interaktif untuk mencari lowongan berdasarkan *Job Title* dengan pengurutan berdasarkan gaji atau jumlah keahlian.
* **Unduh Data**: Tombol ekspor data terfilter langsung ke dalam file CSV untuk analisis lebih lanjut oleh tim AI.

### 6. 👥 Profil Pelamar & Rekrutmen Cerdas (*Applicants & Matchmaking Explorer) - BARU!*
* **Demografi Pelamar**: Grafik sebaran kandidat berdasarkan **24 kategori pekerjaan** (didominasi Accountant, IT, dan HR).
* **Kualitas Resume**: Histogram distribusi jumlah kata bersih resume untuk mengukur kelengkapan data kandidat.
* **Matchmaking Explorer**: Pencarian rekrutmen cerdas interaktif untuk memfilter pelamar berdasarkan **Kategori Pekerjaan**, **Kata Kunci Keahlian** spesifik (contoh: mencari pelamar IT yang menguasai `python`), dan **Jumlah Keahlian** minimum.
* **Unduh Talenta**: Fitur mengekspor dan mengunduh profil talenta yang cocok ke dalam file CSV (`matched_candidates.csv`).

---

## 🛠️ Panduan Instalasi & Menjalankan Dashboard (Lokal)

> [!IMPORTANT]
> **PENTING:** Anda wajib menginstal seluruh pustaka (*dependencies*) di dalam file `requirements.txt` terlebih dahulu sebelum mencoba menjalankan aplikasi `app.py`. Jika tidak, aplikasi akan mengalami kegagalan *ModuleNotFoundError* karena pustaka seperti `plotly` dan `streamlit` belum terpasang.

Ikuti langkah-langkah mudah berikut untuk menjalankan aplikasi web Streamlit ini di perangkat Windows / macOS / Linux Anda:

### 1. Prasyarat (*Prerequisites*)
Pastikan Anda sudah menginstal Python (versi 3.8 - 3.12 direkomendasikan) pada sistem Anda.

### 2. Buka Terminal & Navigasikan ke Folder Aplikasi
Buka Terminal / Git Bash / Command Prompt, lalu arahkan ke dalam direktori aplikasi Streamlit:
```bash
cd "Capstone Project/Streamlit Apps"
```

### 3. Instal Dependencies Terlebih Dahulu (Wajib)
Instal seluruh library Python yang diperlukan dari file `requirements.txt` untuk memastikan semua modul terpasang dengan benar sebelum menjalankan aplikasi:
```bash
pip install -r requirements.txt
```
*Atau jika ingin menginstal manual secara mandiri:*
```bash
pip install streamlit pandas numpy plotly
```

### 4. Jalankan Aplikasi Streamlit
Setelah seluruh instalasi dependencies selesai, luncurkan server Streamlit lokal dengan menjalankan perintah berikut:
```bash
streamlit run app.py
```

Setelah server aktif, dashboard akan **secara otomatis terbuka di browser Anda** pada alamat default:
👉 `http://localhost:8501`

---

## 📁 Struktur Berkas Penting
* **`app.py`**: Berkas kode utama aplikasi Streamlit (mencakup data loading, visualisasi Plotly, filter sidebar, dan Matchmaking Explorer).
* **`df_jobs_final.csv`**: Dataset utama lowongan kerja Indonesia hasil gabungan all.csv dan JobStreet.
* **`../all_resumes.csv`**: Dataset resume pelamar hasil ETL pipeline lengkap dengan kolom `extracted_skills`.
* **`requirements.txt`**: Daftar library dependencies yang dibutuhkan untuk deployment.

Selamat menganalisis dan bereksperimen dengan pasar talenta cerdas Indonesia! 💼✨
