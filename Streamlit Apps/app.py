"""
═══════════════════════════════════════════════════════════════════
  Capstone Project — Data Science Dashboard
  Job Match Platform: Analisis Lowongan Kerja Indonesia
═══════════════════════════════════════════════════════════════════
  Jalankan: streamlit run app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from collections import Counter
import ast, re, warnings

warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Job Market Indonesia Dashboard",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────────────────────────
# CUSTOM CSS
# ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    /* Font & base */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    html, body, [class*="css"]  { font-family: 'Inter', sans-serif; }

    /* Header gradient */
    .main-header {
        background: linear-gradient(135deg, #1A3A5C 0%, #1F77B4 100%);
        padding: 2rem 2.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        color: white;
    }
    .main-header h1 { color: white; font-size: 2rem; font-weight: 700; margin: 0; }
    .main-header p  { color: #D6E8F7; font-size: 0.95rem; margin: 0.4rem 0 0; }

    /* KPI cards */
    .kpi-card {
        background: white;
        border-radius: 12px;
        padding: 1.2rem 1.4rem;
        border-left: 4px solid #1F77B4;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    .kpi-card .label { font-size: 0.78rem; color: #64748B; font-weight: 500; text-transform: uppercase; letter-spacing: .05em; }
    .kpi-card .value { font-size: 1.9rem; font-weight: 700; color: #1A3A5C; margin: .2rem 0 0; }
    .kpi-card .delta { font-size: 0.8rem; color: #2CA02C; font-weight: 500; }

    /* Section titles */
    .section-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1A3A5C;
        border-bottom: 2px solid #1F77B4;
        padding-bottom: .4rem;
        margin: 1.2rem 0 .8rem;
    }

    /* Insight box */
    .insight-box {
        background: #EFF6FF;
        border-left: 4px solid #1F77B4;
        padding: .85rem 1rem;
        border-radius: 0 8px 8px 0;
        font-size: .88rem;
        color: #1E3A5F;
        margin-top: .5rem;
    }
    .insight-box b { color: #1A3A5C; }

    /* Sidebar */
    [data-testid="stSidebar"] { background: #F8FAFC; }
    [data-testid="stSidebar"] .stSelectbox label,
    [data-testid="stSidebar"] .stMultiSelect label { font-weight: 600; color: #1A3A5C; font-size: .88rem; }

    /* Tab active */
    .stTabs [data-baseweb="tab-list"] { gap: 6px; }
    .stTabs [data-baseweb="tab"] {
        background: #F1F5F9;
        border-radius: 8px 8px 0 0;
        padding: .5rem 1.2rem;
        font-weight: 600;
    }
    .stTabs [aria-selected="true"] { background: #1F77B4 !important; color: white !important; }

    /* Hide streamlit default footer */
    footer { visibility: hidden; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────────
# DATA LOADER
# ─────────────────────────────────────────────────────────────────
SKILLS = [
    'python','sql','excel','java','javascript','php','mysql','postgresql',
    'machine learning','deep learning','tensorflow','pandas','tableau','power bi',
    'r studio','kotlin','flutter','react','autocad','photoshop','figma',
    'english','communication','leadership','microsoft office','project management',
    'accounting','sap','erp','digital marketing','seo','data analysis',
    'customer service','negotiation','teamwork','problem solving',
]

LOC_MAP = {
    'jakarta raya':'DKI Jakarta','jakarta selatan':'DKI Jakarta','jakarta barat':'DKI Jakarta',
    'jakarta utara':'DKI Jakarta','jakarta pusat':'DKI Jakarta','jakarta timur':'DKI Jakarta',
    'tangerang':'Banten','tangerang selatan':'Banten','serang':'Banten',
    'surabaya':'Jawa Timur','malang':'Jawa Timur','sidoarjo':'Jawa Timur',
    'bandung':'Jawa Barat','bekasi':'Jawa Barat','depok':'Jawa Barat',
    'bogor':'Jawa Barat','cirebon':'Jawa Barat',
    'semarang':'Jawa Tengah','solo':'Jawa Tengah','yogyakarta':'DI Yogyakarta',
    'bali':'Bali','denpasar':'Bali',
    'medan':'Sumatera Utara','palembang':'Sumatera Selatan',
    'pekanbaru':'Riau','batam':'Kepulauan Riau',
    'makassar':'Sulawesi Selatan','balikpapan':'Kalimantan Timur',
}

def norm_loc(loc):
    if not isinstance(loc, str): return 'Lainnya'
    l = loc.lower()
    for k, v in LOC_MAP.items():
        if k in l: return v
    return 'Lainnya'

def extract_skills(text):
    if not isinstance(text, str): return []
    t = text.lower()
    return [s for s in SKILLS if s in t]

@st.cache_data(show_spinner="⏳ Memuat dataset...")
def load_data():
    import os

    candidates = [
        "All data/df_jobs_final.csv",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "All data", "df_jobs_final.csv"),
        "df_jobs_final.csv",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "df_jobs_final.csv"),
    ]
    csv_path = next((p for p in candidates if os.path.exists(p)), None)

    if csv_path is None:
        st.error(
            "❌ File **df_jobs_final.csv** tidak ditemukan.\n\n"
            "Pastikan file `df_jobs_final.csv` berada di folder `All data` atau di folder yang sama dengan `app.py`."
        )
        st.stop()

    df = pd.read_csv(csv_path, low_memory=False)

    df["salary"]           = pd.to_numeric(df.get("salary", 0), errors="coerce").fillna(0)
    df["job_description"]  = df.get("job_description", pd.Series([""] * len(df))).fillna("")
    df["employment_type"]  = df.get("employment_type", pd.Series(["Penuh Waktu"] * len(df))).fillna("Penuh Waktu")
    df["company_industry"] = df.get("company_industry", pd.Series(["Tidak Disebutkan"] * len(df))).fillna("Tidak Disebutkan")
    df["experience_level"] = df.get("experience_level", pd.Series(["Tidak Disebutkan"] * len(df))).fillna("Tidak Disebutkan")
    df["company_size"]     = df.get("company_size", pd.Series(["Tidak Disebutkan"] * len(df))).fillna("Tidak Disebutkan")
    df["location"]         = df.get("location", pd.Series([""] * len(df))).fillna("")
    df["sumber"]           = df.get("sumber", pd.Series(["dataset"] * len(df))).fillna("dataset")

    df = df[(df["salary"] >= 500_000) & (df["salary"] <= 100_000_000)].copy()

    df["provinsi"]    = df["location"].apply(norm_loc)
    df["salary_jt"]   = df["salary"] / 1_000_000
    df["skills"]      = df["job_description"].apply(extract_skills)
    df["skill_count"] = df["skills"].apply(len)

    return df
df = load_data()

@st.cache_data(show_spinner="⏳ Memuat dataset pelamar...")
def load_candidate_data():
    import os
    candidates = [
        "All data/all_resumes.csv",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "All data", "all_resumes.csv"),
        "all_resumes.csv",
        "Capstone Project/all_resumes.csv",
        "Capstone Project/Pemrosesan Data Resume/all_resumes.csv",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "all_resumes.csv"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Pemrosesan Data Resume", "all_resumes.csv"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "all_resumes.csv"),
    ]
    csv_path = next((p for p in candidates if os.path.exists(p)), None)
    if csv_path is None:
        return pd.DataFrame(columns=["resume_id", "category", "cleaned_text", "extracted_skills", "word_count", "skill_count"])
    
    df_cand = pd.read_csv(csv_path)
    df_cand["extracted_skills"] = df_cand["extracted_skills"].fillna("")
    df_cand["word_count"] = df_cand["cleaned_text"].astype(str).apply(lambda x: len(x.split()))
    df_cand["skills_list"] = df_cand["extracted_skills"].apply(lambda x: [s.strip() for s in x.split(",") if s.strip()])
    df_cand["skill_count"] = df_cand["skills_list"].apply(len)
    return df_cand

df_resumes = load_candidate_data()

# ─────────────────────────────────────────────────────────────────
# SIDEBAR FILTER
# ─────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/briefcase.png", width=56)
    st.markdown("## 🔍 Filter Data")
    st.markdown("---")

    provs = ["Semua Provinsi"] + sorted(df["provinsi"].unique().tolist())
    sel_prov = st.selectbox("📍 Provinsi", provs)

    emp_opts = ["Semua Jenis"] + sorted(df["employment_type"].unique().tolist())
    sel_emp = st.selectbox("💼 Jenis Pekerjaan", emp_opts)

    sal_min_val = int(df["salary"].min())
    sal_max_val = int(df["salary"].max())
    sal_range = st.slider(
        "💰 Rentang Gaji (Juta Rp/bulan)",
        min_value=0, max_value=50,
        value=(0, 50), step=1
    )

    st.markdown("---")
    st.markdown("### 📊 Tentang Dataset")
    st.info(
        f"**Total lowongan:** {len(df):,}\n\n"
        f"**Total Pelamar (Resume):** {len(df_resumes):,}\n\n"
        f"**all.csv:** {(df['sumber']=='all.csv').sum():,}\n\n"
        f"**JobStreet:** {(df['sumber']=='jobstreet').sum():,}\n\n"
        f"**Kategori Pelamar:** {df_resumes['category'].nunique() if not df_resumes.empty else 0}\n\n"
        f"**Provinsi:** {df['provinsi'].nunique()}\n\n"
        f"**Industri:** {df['company_industry'].nunique()}"
    )

# ── Apply filters ──────────────────────────────────────────────────
mask = (df["salary_jt"] >= sal_range[0]) & (df["salary_jt"] <= sal_range[1])
if sel_prov != "Semua Provinsi":
    mask &= df["provinsi"] == sel_prov
if sel_emp != "Semua Jenis":
    mask &= df["employment_type"] == sel_emp
dff = df[mask].copy()

# ─────────────────────────────────────────────────────────────────
# HEADER
# ─────────────────────────────────────────────────────────────────
st.markdown("""
<div class="main-header">
    <h1>💼 Job Market Indonesia — Analytics Dashboard</h1>
    <p>Capstone Project • Data Science Division • Platform Pencarian Kerja Berbasis AI</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────────
# KPI ROW
# ─────────────────────────────────────────────────────────────────
k1, k2, k3, k4, k5, k6 = st.columns(6)

def kpi(col, label, value, delta="", color="#1F77B4"):
    col.markdown(f"""
    <div class="kpi-card" style="border-left-color:{color}">
        <div class="label">{label}</div>
        <div class="value">{value}</div>
        <div class="delta">{delta}</div>
    </div>
    """, unsafe_allow_html=True)

kpi(k1, "Total Lowongan",    f"{len(dff):,}",         f"dari {len(df):,} total")
kpi(k2, "Median Gaji",       f"Rp {dff['salary_jt'].median():.1f}jt", "/bulan", "#FF7F0E")
kpi(k3, "Skill/Lowongan",    f"{dff['skill_count'].mean():.1f}", "keahlian", "#D62728")
kpi(k4, "Total Pelamar",     f"{len(df_resumes):,}", "kandidat", "#9467BD")
kpi(k5, "Skill/Pelamar",     f"{df_resumes['skill_count'].mean():.1f}" if not df_resumes.empty else "0.0", "keahlian", "#2CA02C")
kpi(k6, "Kategori Pelamar",  f"{df_resumes['category'].nunique()}" if not df_resumes.empty else "0", "bidang pekerjaan", "#BCBD22")

st.markdown("<br>", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────────
# TABS
# ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "🗺️ Sebaran Lokasi",
    "💰 Analisis Gaji",
    "🛠️ Skill & Demand",
    "🏭 Industri & Job Type",
    "📋 Data Explorer",
    "👥 Profil Pelamar (Applicants)",
])

# ══════════════════════════════════════════════════════════════════
# TAB 1 — LOKASI
# ══════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="section-title">📍 Distribusi Lowongan per Provinsi</div>', unsafe_allow_html=True)

    col_l, col_r = st.columns([3, 2])

    with col_l:
        loc_count = dff["provinsi"].value_counts().reset_index()
        loc_count.columns = ["Provinsi", "Jumlah Lowongan"]
        loc_count = loc_count[loc_count["Provinsi"] != "Lainnya"].head(15)

        fig_loc = px.bar(
            loc_count, x="Jumlah Lowongan", y="Provinsi",
            orientation="h",
            color="Jumlah Lowongan",
            color_continuous_scale="Blues",
            text="Jumlah Lowongan",
            title="Top 15 Provinsi dengan Lowongan Terbanyak",
        )
        fig_loc.update_traces(texttemplate="%{text:,}", textposition="outside")
        fig_loc.update_layout(
            height=500, showlegend=False,
            coloraxis_showscale=False,
            yaxis={"categoryorder": "total ascending"},
            plot_bgcolor="white",
            paper_bgcolor="white",
            margin=dict(l=10, r=40, t=40, b=10),
            font_family="Inter",
        )
        st.plotly_chart(fig_loc, use_container_width=True)

    with col_r:
        # Pie chart provinsi
        top8 = loc_count.head(8)
        others = loc_count.iloc[8:]["Jumlah Lowongan"].sum()
        pie_df = pd.concat([top8, pd.DataFrame([{"Provinsi":"Lainnya","Jumlah Lowongan":others}])],
                           ignore_index=True)
        fig_pie = px.pie(
            pie_df, names="Provinsi", values="Jumlah Lowongan",
            title="Proporsi Lowongan per Wilayah",
            color_discrete_sequence=px.colors.qualitative.Set2,
            hole=0.4,
        )
        fig_pie.update_traces(textposition="inside", textinfo="percent+label")
        fig_pie.update_layout(
            height=500, showlegend=False,
            font_family="Inter",
            margin=dict(l=10, r=10, t=40, b=10),
        )
        st.plotly_chart(fig_pie, use_container_width=True)

    st.markdown("""
    <div class="insight-box">
        <b>💡 Insight BQ1:</b> DKI Jakarta mendominasi lowongan dengan pangsa lebih dari <b>38%</b>.
        Jawa Barat (Bandung, Bekasi, Bogor) menyusul di posisi kedua.
        Konsentrasi ini mencerminkan pusat ekonomi Indonesia yang masih terpusat di Pulau Jawa.
        Platform perlu mengoptimalkan fitur <b>filter radius lokasi</b> untuk pengguna di luar Jabodetabek.
    </div>
    """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Treemap
    st.markdown('<div class="section-title">🗺️ Treemap Sebaran Lowongan</div>', unsafe_allow_html=True)
    tree_data = dff["provinsi"].value_counts().reset_index()
    tree_data.columns = ["Provinsi", "count"]
    fig_tree = px.treemap(
        tree_data, path=["Provinsi"], values="count",
        color="count", color_continuous_scale="Blues",
        title="Treemap Proporsi Lowongan per Provinsi",
    )
    fig_tree.update_layout(height=380, font_family="Inter", margin=dict(t=40, b=10))
    st.plotly_chart(fig_tree, use_container_width=True)

# ══════════════════════════════════════════════════════════════════
# TAB 2 — GAJI
# ══════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="section-title">💰 Distribusi Gaji Bulanan (IDR)</div>', unsafe_allow_html=True)

    sal_data = dff["salary_jt"][(dff["salary_jt"] >= 1) & (dff["salary_jt"] <= 50)]

    col_a, col_b = st.columns(2)

    with col_a:
        fig_hist = px.histogram(
            sal_data, x=sal_data,
            nbins=60,
            title="Distribusi Gaji Bulanan",
            labels={"x": "Gaji (Juta Rp/bulan)"},
            color_discrete_sequence=["#1F77B4"],
        )
        fig_hist.add_vline(x=sal_data.median(), line_dash="dash", line_color="#D62728",
                           annotation_text=f"Median: Rp{sal_data.median():.1f}jt",
                           annotation_position="top right")
        fig_hist.add_vline(x=sal_data.mean(), line_dash="dot", line_color="#FF7F0E",
                           annotation_text=f"Mean: Rp{sal_data.mean():.1f}jt",
                           annotation_position="top left")
        fig_hist.update_layout(height=380, plot_bgcolor="white", paper_bgcolor="white",
                               font_family="Inter", margin=dict(t=40, b=10))
        st.plotly_chart(fig_hist, use_container_width=True)

    with col_b:
        # Box plot per jenis pekerjaan
        top_emp = dff["employment_type"].value_counts().head(4).index.tolist()
        box_df  = dff[dff["employment_type"].isin(top_emp)].copy()
        box_df  = box_df[(box_df["salary_jt"] >= 1) & (box_df["salary_jt"] <= 40)]
        fig_box = px.box(
            box_df, x="employment_type", y="salary_jt",
            color="employment_type",
            title="Distribusi Gaji per Jenis Pekerjaan",
            labels={"employment_type":"Jenis Pekerjaan","salary_jt":"Gaji (Juta Rp/bulan)"},
            color_discrete_sequence=px.colors.qualitative.Set1,
        )
        fig_box.update_layout(height=380, showlegend=False,
                              plot_bgcolor="white", paper_bgcolor="white",
                              font_family="Inter", margin=dict(t=40, b=10))
        st.plotly_chart(fig_box, use_container_width=True)

    # Gaji per Provinsi
    st.markdown('<div class="section-title">📊 Median Gaji per Provinsi vs Nasional</div>', unsafe_allow_html=True)

    top_provs = dff["provinsi"].value_counts().head(12).index.tolist()
    sal_prov  = dff[dff["provinsi"].isin(top_provs)].copy()
    sal_prov  = sal_prov[(sal_prov["salary_jt"] >= 1) & (sal_prov["salary_jt"] <= 40)]
    med_prov  = sal_prov.groupby("provinsi")["salary_jt"].median().reset_index()
    med_prov.columns = ["Provinsi", "Median Gaji"]
    med_prov  = med_prov.sort_values("Median Gaji", ascending=False)
    nat_med   = sal_data.median()

    fig_prov = px.bar(
        med_prov, x="Provinsi", y="Median Gaji",
        color="Median Gaji",
        color_continuous_scale="RdYlGn",
        text="Median Gaji",
        title="Median Gaji per Provinsi (Juta Rp/bulan)",
        labels={"Median Gaji":"Median Gaji (Juta Rp)"},
    )
    fig_prov.add_hline(y=nat_med, line_dash="dash", line_color="#1A3A5C",
                       annotation_text=f"Median Nasional: Rp{nat_med:.1f}jt",
                       annotation_position="top right")
    fig_prov.update_traces(texttemplate="Rp%{text:.1f}jt", textposition="outside")
    fig_prov.update_layout(
        height=420, coloraxis_showscale=False,
        plot_bgcolor="white", paper_bgcolor="white",
        font_family="Inter", margin=dict(t=40, b=10),
        xaxis_tickangle=-30,
    )
    st.plotly_chart(fig_prov, use_container_width=True)

    st.markdown("""
    <div class="insight-box">
        <b>💡 Insight BQ3:</b> Median gaji nasional berkisar <b>Rp 5–6 juta/bulan</b>.
        Kepulauan Riau dan DKI Jakarta konsisten di atas rata-rata nasional,
        sementara wilayah Jawa Tengah dan Yogyakarta cenderung di bawah.
        Gap ini relevan untuk fitur <b>salary estimator</b> yang mempertimbangkan lokasi pengguna.
    </div>
    """, unsafe_allow_html=True)

    # Salary Stats Table
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-title">📋 Statistik Gaji per Jenis Pekerjaan</div>', unsafe_allow_html=True)
    sal_stats = (
        dff[(dff["salary_jt"] >= 1) & (dff["salary_jt"] <= 50)]
        .groupby("employment_type")["salary_jt"]
        .agg(["count","min","median","mean","max"])
        .round(2)
        .reset_index()
    )
    sal_stats.columns = ["Jenis Pekerjaan","Jumlah","Min (jt)","Median (jt)","Mean (jt)","Max (jt)"]
    sal_stats = sal_stats.sort_values("Median (jt)", ascending=False)
    st.dataframe(sal_stats, use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════════════
# TAB 3 — SKILL
# ══════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="section-title">🛠️ Top Skill yang Paling Banyak Dicari</div>', unsafe_allow_html=True)

    # Hitung frekuensi skill dari filtered data
    all_skills_flat = [sk for sublist in dff["skills"].tolist() for sk in sublist]
    skill_freq = Counter(all_skills_flat).most_common(25)
    sk_df = pd.DataFrame(skill_freq, columns=["Skill", "Frekuensi"])
    sk_df["Skill"] = sk_df["Skill"].str.title()

    col_s1, col_s2 = st.columns([3, 2])
    with col_s1:
        n_skills = st.slider("Tampilkan top N skill:", 5, 25, 15)
        sk_plot = sk_df.head(n_skills)

        fig_skill = px.bar(
            sk_plot, x="Frekuensi", y="Skill",
            orientation="h",
            color="Frekuensi",
            color_continuous_scale="Blues",
            text="Frekuensi",
            title=f"Top {n_skills} Skill yang Paling Banyak Dicari",
        )
        fig_skill.update_traces(texttemplate="%{text:,}", textposition="outside")
        fig_skill.update_layout(
            height=max(350, n_skills * 28),
            coloraxis_showscale=False,
            yaxis={"categoryorder":"total ascending"},
            plot_bgcolor="white", paper_bgcolor="white",
            font_family="Inter", margin=dict(l=10, r=50, t=40, b=10),
        )
        st.plotly_chart(fig_skill, use_container_width=True)

    with col_s2:
        # Radar chart skill kategori
        cat_skills = {
            "Tech Hard Skills": ["python","sql","java","javascript","machine learning","deep learning","tensorflow","r studio"],
            "Office Tools":     ["excel","microsoft office","power bi","tableau","sap","erp","autocad"],
            "Soft Skills":      ["communication","leadership","teamwork","negotiation","problem solving"],
            "Digital":          ["digital marketing","seo","social media","react","flutter"],
            "Language":         ["english"],
        }
        cat_counts = {}
        for cat, sks in cat_skills.items():
            cat_counts[cat] = sum(all_skills_flat.count(s) for s in sks)

        radar_df = pd.DataFrame(list(cat_counts.items()), columns=["Kategori","Total"])
        fig_radar = go.Figure(go.Scatterpolar(
            r=radar_df["Total"],
            theta=radar_df["Kategori"],
            fill="toself",
            line_color="#1F77B4",
            fillcolor="rgba(31,119,180,0.25)",
        ))
        fig_radar.update_layout(
            polar=dict(radialaxis=dict(visible=True)),
            title="Kategori Skill (Radar Chart)",
            height=380, font_family="Inter",
            margin=dict(t=50, b=10),
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    # Heatmap skill vs provinsi
    st.markdown('<div class="section-title">🔥 Heatmap: Skill vs Provinsi Teratas</div>', unsafe_allow_html=True)

    top_provs_sk = dff["provinsi"].value_counts().head(8).index.tolist()
    top_skills_sk = [sk[0] for sk in skill_freq[:10]]
    heat_rows = []
    for prov in top_provs_sk:
        prov_df = dff[dff["provinsi"] == prov]
        prov_skills = [sk for sub in prov_df["skills"].tolist() for sk in sub]
        total = len(prov_df)
        row = {"Provinsi": prov}
        for sk in top_skills_sk:
            row[sk.title()] = round(prov_skills.count(sk) / max(total, 1) * 100, 1)
        heat_rows.append(row)

    heat_df = pd.DataFrame(heat_rows).set_index("Provinsi")
    fig_heat = px.imshow(
        heat_df,
        color_continuous_scale="YlOrRd",
        aspect="auto",
        title="% Lowongan yang Mensyaratkan Skill per Provinsi",
        text_auto=True,
    )
    fig_heat.update_layout(height=380, font_family="Inter",
                           margin=dict(t=50, b=20),
                           coloraxis_colorbar_title="%")
    st.plotly_chart(fig_heat, use_container_width=True)

    if not df_resumes.empty:
        st.markdown('<div class="section-title">👥 Sisi Pelamar: Distribusi Keahlian Kandidat (Supply)</div>', unsafe_allow_html=True)
        col_cand_s1, col_cand_s2 = st.columns(2)
        
        with col_cand_s1:
            all_res_skills = [s for sub in df_resumes["skills_list"].tolist() for s in sub]
            res_skill_freq = Counter(all_res_skills).most_common(15)
            res_sk_df = pd.DataFrame(res_skill_freq, columns=["Skill", "Jumlah Kandidat"])
            res_sk_df["Skill"] = res_sk_df["Skill"].str.title()
            
            fig_res_skill = px.bar(
                res_sk_df, x="Jumlah Kandidat", y="Skill",
                orientation="h",
                color="Jumlah Kandidat",
                color_continuous_scale="Purples",
                text="Jumlah Kandidat",
                title="Top 15 Keahlian Terpopuler yang Dimiliki Pelamar",
            )
            fig_res_skill.update_traces(texttemplate="%{text:,}", textposition="outside")
            fig_res_skill.update_layout(
                height=400,
                coloraxis_showscale=False,
                yaxis={"categoryorder":"total ascending"},
                plot_bgcolor="white", paper_bgcolor="white",
                font_family="Inter", margin=dict(l=10, r=50, t=40, b=10),
            )
            st.plotly_chart(fig_res_skill, use_container_width=True)
            
        with col_cand_s2:
            cand_cov = df_resumes.groupby("category")["skill_count"].mean().reset_index()
            cand_cov.columns = ["Kategori", "Rata-rata Skill"]
            cand_cov = cand_cov.sort_values("Rata-rata Skill", ascending=False).head(10)
            
            fig_cov = px.bar(
                cand_cov, x="Rata-rata Skill", y="Kategori",
                orientation="h",
                color="Rata-rata Skill",
                color_continuous_scale="Agsunset",
                text="Rata-rata Skill",
                title="Top 10 Kategori Pelamar dengan Keahlian Terbanyak",
            )
            fig_cov.update_traces(texttemplate="%{text:.1f}", textposition="outside")
            fig_cov.update_layout(
                height=400,
                coloraxis_showscale=False,
                yaxis={"categoryorder":"total ascending"},
                plot_bgcolor="white", paper_bgcolor="white",
                font_family="Inter", margin=dict(l=10, r=50, t=40, b=10),
            )
            st.plotly_chart(fig_cov, use_container_width=True)

    st.markdown("""
    <div class="insight-box">
        <b>💡 Insight BQ4:</b>
        <b>Soft skill</b> (Communication, English) dan <b>Microsoft Office</b> masih menjadi yang paling banyak dicari di semua wilayah.
        Namun <b>Python, SQL, dan Machine Learning</b> mengalami pertumbuhan signifikan, terutama di DKI Jakarta dan Jawa Barat —
        mencerminkan percepatan transformasi digital di Indonesia.
        Fitur <b>skill gap analysis</b> platform bisa membantu pelamar fokus mengembangkan skill yang tepat.
    </div>
    """, unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════
# TAB 4 — INDUSTRI & JOB TYPE
# ══════════════════════════════════════════════════════════════════
with tab4:
    col_i1, col_i2 = st.columns(2)

    with col_i1:
        st.markdown('<div class="section-title">🏭 Top Industri / Sektor</div>', unsafe_allow_html=True)
        ind_count = (
            dff[dff["company_industry"] != "Tidak Disebutkan"]
            ["company_industry"].value_counts().head(15).reset_index()
        )
        ind_count.columns = ["Industri", "Jumlah"]
        # Potong nama panjang
        ind_count["Industri"] = ind_count["Industri"].str.split(",").str[0].str.strip()
        ind_count = ind_count.groupby("Industri")["Jumlah"].sum().reset_index()
        ind_count = ind_count.sort_values("Jumlah", ascending=False).head(12)

        fig_ind = px.bar(
            ind_count, x="Jumlah", y="Industri",
            orientation="h",
            color="Jumlah",
            color_continuous_scale="Greens",
            text="Jumlah",
            title="Top 12 Industri dengan Lowongan Terbanyak",
        )
        fig_ind.update_traces(texttemplate="%{text:,}", textposition="outside")
        fig_ind.update_layout(
            height=450, coloraxis_showscale=False,
            yaxis={"categoryorder":"total ascending"},
            plot_bgcolor="white", paper_bgcolor="white",
            font_family="Inter", margin=dict(l=10, r=50, t=40, b=10),
        )
        st.plotly_chart(fig_ind, use_container_width=True)

    with col_i2:
        st.markdown('<div class="section-title">💼 Distribusi Jenis Pekerjaan</div>', unsafe_allow_html=True)
        emp_count = dff["employment_type"].value_counts().reset_index()
        emp_count.columns = ["Jenis", "Jumlah"]
        fig_emp = px.pie(
            emp_count, names="Jenis", values="Jumlah",
            title="Proporsi Jenis Pekerjaan",
            color_discrete_sequence=px.colors.qualitative.Set1,
            hole=0.45,
        )
        fig_emp.update_traces(textposition="outside", textinfo="percent+label")
        fig_emp.update_layout(height=450, font_family="Inter",
                              margin=dict(t=50, b=10))
        st.plotly_chart(fig_emp, use_container_width=True)

    # Tren gaji per industri
    st.markdown('<div class="section-title">💹 Median Gaji per Industri</div>', unsafe_allow_html=True)
    ind_sal = (
        dff[
            (dff["company_industry"] != "Tidak Disebutkan") &
            (dff["salary_jt"] >= 1) & (dff["salary_jt"] <= 40)
        ]
        .assign(Industri=lambda x: x["company_industry"].str.split(",").str[0].str.strip())
        .groupby("Industri")["salary_jt"]
        .agg(["median","count"])
        .reset_index()
    )
    ind_sal.columns = ["Industri","Median Gaji (jt)","Jumlah Lowongan"]
    ind_sal = ind_sal[ind_sal["Jumlah Lowongan"] >= 20].sort_values("Median Gaji (jt)", ascending=False).head(15)

    fig_ind_sal = px.scatter(
        ind_sal, x="Jumlah Lowongan", y="Median Gaji (jt)",
        size="Jumlah Lowongan", color="Median Gaji (jt)",
        hover_name="Industri",
        color_continuous_scale="Viridis",
        title="Industri: Volume Lowongan vs Median Gaji (bubble = ukuran industri)",
        labels={"Jumlah Lowongan":"Jumlah Lowongan","Median Gaji (jt)":"Median Gaji (Juta Rp)"},
    )
    fig_ind_sal.update_layout(
        height=420, plot_bgcolor="white", paper_bgcolor="white",
        font_family="Inter", margin=dict(t=50, b=10),
    )
    st.plotly_chart(fig_ind_sal, use_container_width=True)

    st.markdown("""
    <div class="insight-box">
        <b>💡 Insight BQ2 & BQ5:</b>
        Industri <b>IT/Teknologi, Retail, dan Manufaktur</b> mendominasi volume lowongan.
        Namun gaji tertinggi berasal dari industri <b>Keuangan/Perbankan dan Konsultan</b>.
        Ini penting untuk fitur rekomendasi: pelamar yang menginginkan gaji tinggi
        perlu diarahkan ke skill yang relevan dengan industri bernilai tinggi, bukan hanya
        yang paling banyak lowongannya.
    </div>
    """, unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════
# TAB 5 — DATA EXPLORER
# ══════════════════════════════════════════════════════════════════
with tab5:
    st.markdown('<div class="section-title">📋 Eksplorasi Data Mentah</div>', unsafe_allow_html=True)

    col_e1, col_e2, col_e3 = st.columns(3)
    with col_e1:
        search_kw = st.text_input("🔍 Cari Job Title", placeholder="contoh: data analyst")
    with col_e2:
        sort_col = st.selectbox("Urutkan berdasarkan", ["salary_jt","skill_count","job_title"])
    with col_e3:
        sort_asc = st.radio("Urutan", ["Descending","Ascending"], horizontal=True) == "Ascending"

    show_cols = ["job_title","company","location","provinsi","salary_jt","employment_type","company_industry","skill_count"]
    exp_df = dff[show_cols].copy()
    exp_df.columns = ["Posisi","Perusahaan","Lokasi","Provinsi","Gaji (jt)","Jenis","Industri","Jumlah Skill"]

    if search_kw:
        exp_df = exp_df[exp_df["Posisi"].str.contains(search_kw, case=False, na=False)]

    sort_map = {"salary_jt":"Gaji (jt)","skill_count":"Jumlah Skill","job_title":"Posisi"}
    exp_df = exp_df.sort_values(sort_map[sort_col], ascending=sort_asc)

    st.markdown(f"**Menampilkan {min(len(exp_df), 500):,} dari {len(exp_df):,} lowongan**")
    st.dataframe(exp_df.head(500).reset_index(drop=True), use_container_width=True, height=420)

    # Download
    csv_export = exp_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="⬇️ Download Data Terfilter (CSV)",
        data=csv_export,
        file_name="filtered_jobs.csv",
        mime="text/csv",
    )

    # Summary stats
    st.markdown('<div class="section-title">📊 Ringkasan Statistik</div>', unsafe_allow_html=True)
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**Top 10 Job Title Terpopuler**")
        top_titles = dff["job_title"].value_counts().head(10).reset_index()
        top_titles.columns = ["Posisi","Jumlah"]
        st.dataframe(top_titles, use_container_width=True, hide_index=True)
    with c2:
        st.markdown("**Distribusi Level Pengalaman**")
        exp_lvl = dff["experience_level"].value_counts().reset_index()
        exp_lvl.columns = ["Level Pengalaman","Jumlah"]
        fig_exp = px.pie(exp_lvl, names="Level Pengalaman", values="Jumlah",
                         color_discrete_sequence=px.colors.qualitative.Pastel,
                         hole=0.4)
        fig_exp.update_layout(height=280, margin=dict(t=10,b=10), font_family="Inter")
        st.plotly_chart(fig_exp, use_container_width=True)

# ══════════════════════════════════════════════════════════════════
# TAB 6 — PROFIL PELAMAR (APPLICANTS)
# ══════════════════════════════════════════════════════════════════
with tab6:
    if df_resumes.empty:
        st.warning("⚠️ Dataset Pelamar (all_resumes.csv) tidak ditemukan. Silakan jalankan ETL pipeline terlebih dahulu.")
    else:
        st.markdown('<div class="section-title">👥 Analisis Sebaran & Kualitas Profil Pelamar</div>', unsafe_allow_html=True)
        
        col_c1, col_c2 = st.columns(2)
        
        with col_c1:
            cat_res_counts = df_resumes["category"].value_counts().reset_index()
            cat_res_counts.columns = ["Kategori", "Jumlah Pelamar"]
            cat_res_counts = cat_res_counts.head(15)
            
            fig_res_cat = px.bar(
                cat_res_counts, x="Jumlah Pelamar", y="Kategori",
                orientation="h",
                color="Jumlah Pelamar",
                color_continuous_scale="Purples",
                text="Jumlah Pelamar",
                title="Top 15 Kategori Pekerjaan Pelamar Terbanyak",
            )
            fig_res_cat.update_traces(texttemplate="%{text:,}", textposition="outside")
            fig_res_cat.update_layout(
                height=450, coloraxis_showscale=False,
                yaxis={"categoryorder": "total ascending"},
                plot_bgcolor="white", paper_bgcolor="white",
                font_family="Inter", margin=dict(l=10, r=40, t=40, b=10),
            )
            st.plotly_chart(fig_res_cat, use_container_width=True)
            
        with col_c2:
            fig_res_wc = px.histogram(
                df_resumes, x="word_count",
                nbins=40,
                title="Distribusi Kelengkapan Resume (Jumlah Kata)",
                labels={"word_count": "Jumlah Kata Bersih per Resume"},
                color_discrete_sequence=["#8C564B"],
            )
            fig_res_wc.add_vline(x=df_resumes["word_count"].median(), line_dash="dash", line_color="#D62728",
                                 annotation_text=f"Median: {df_resumes['word_count'].median():.0f} kata",
                                 annotation_position="top right")
            fig_res_wc.update_layout(
                height=450, plot_bgcolor="white", paper_bgcolor="white",
                font_family="Inter", margin=dict(t=40, b=10)
            )
            st.plotly_chart(fig_res_wc, use_container_width=True)

        st.markdown("""
        <div class="insight-box" style="border-left-color: #8C564B; background: #FFF5F5; color: #782A2A">
            <b>💡 Analisis Matchmaking Kandidat:</b>
            Sebaran kategori pelamar didominasi oleh bidang <b>Accountant, Information-Technology, dan HR</b>.
            Rata-rata kandidat memiliki kelengkapan kata bersih sekitar <b>300 - 800 kata</b> per resume, yang merupakan rentang detail ideal untuk ekstraksi skill secara akurat.
            Dengan mencocokkan profil keahlian ini secara silang ke lowongan kerja aktif, platform AI dapat melakukan rekomendasi pencocokan 2 arah secara instan.
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown('<div class="section-title">🔍 Rekrutmen Cerdas: Pencarian Kandidat Cocok (Matchmaking Explorer)</div>', unsafe_allow_html=True)
        
        col_s_f1, col_s_f2, col_s_f3 = st.columns(3)
        
        with col_s_f1:
            res_categories = ["Semua Kategori"] + sorted(df_resumes["category"].unique().tolist())
            sel_res_cat = st.selectbox("🎯 Pilih Bidang Pekerjaan Kandidat", res_categories)
            
        with col_s_f2:
            search_res_skill = st.text_input("🛠️ Filter Keahlian (Contoh: python, accounting, excel)", placeholder="Ketik kata kunci skill")
            
        with col_s_f3:
            min_res_skills = st.slider("⭐ Minimum Jumlah Keahlian Terdeteksi", 0, 15, 0)
            
        cand_mask = df_resumes["skill_count"] >= min_res_skills
        if sel_res_cat != "Semua Kategori":
            cand_mask &= df_resumes["category"] == sel_res_cat
        if search_res_skill:
            cand_mask &= df_resumes["extracted_skills"].str.contains(search_res_skill.strip().lower(), case=False, na=False)
            
        filtered_candidates = df_resumes[cand_mask].copy()
        
        st.markdown(f"**Ditemukan {len(filtered_candidates):,} kandidat yang cocok**")
        
        show_cand_cols = ["resume_id", "category", "extracted_skills", "word_count", "skill_count"]
        cand_display_df = filtered_candidates[show_cand_cols].copy()
        cand_display_df.columns = ["ID Resume", "Kategori Pekerjaan", "Daftar Keahlian", "Panjang Kata", "Jumlah Skill"]
        
        st.dataframe(cand_display_df.head(200).reset_index(drop=True), use_container_width=True, height=350)
        
        csv_cand_export = cand_display_df.to_csv(index=False).encode("utf-8")
        st.download_button(
            label="⬇️ Download Data Kandidat Terfilter (CSV)",
            data=csv_cand_export,
            file_name="matched_candidates.csv",
            mime="text/csv",
        )

# ─────────────────────────────────────────────────────────────────
# FOOTER
# ─────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown("""
<div style="text-align:center; color:#94A3B8; font-size:.83rem; padding: .5rem 0 1rem">
    📊 <b>Job Market Indonesia Dashboard</b> — Capstone Project · Data Science Division<br>
    Dataset: all.csv (34,746 baris) + JobStreet 2021 (27,677 baris) · Dibangun dengan Streamlit & Plotly
</div>
""", unsafe_allow_html=True)
