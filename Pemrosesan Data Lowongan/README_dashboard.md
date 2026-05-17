# 💼 Job Market Indonesia Dashboard

Dashboard interaktif untuk analisis pasar kerja Indonesia.  
Capstone Project — Data Science Division.

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Pastikan file dataset ada di folder yang sama
```
📁 folder-proyek/
├── app.py
├── requirements.txt
├── all.csv                      ← dataset 1
└── jobstreet_2021-12-13.csv     ← dataset 2
```

### 3. Jalankan Streamlit
```bash
streamlit run app.py
```

Browser akan otomatis terbuka di `http://localhost:8501`

---

## ☁️ Deploy ke Streamlit Cloud (Gratis)

1. Push semua file ke GitHub repo
2. Buka https://share.streamlit.io
3. Klik **New app** → pilih repo → set `app.py` sebagai main file
4. Klik **Deploy** — selesai!

> ⚠️ Pastikan dataset (all.csv & jobstreet_2021-12-13.csv) ikut di-push ke repo.

---

## 📊 Fitur Dashboard

| Tab | Isi |
|-----|-----|
| 🗺️ Sebaran Lokasi | Bar chart, pie chart, treemap provinsi |
| 💰 Analisis Gaji | Histogram, boxplot, median per provinsi |
| 🛠️ Skill & Demand | Bar chart skill, radar chart, heatmap skill vs provinsi |
| 🏭 Industri & Job Type | Top industri, pie jenis pekerjaan, bubble chart gaji vs volume |
| 📋 Data Explorer | Search, filter, sort, download CSV |

## 🔍 Filter Sidebar
- Filter provinsi
- Filter jenis pekerjaan
- Slider rentang gaji

