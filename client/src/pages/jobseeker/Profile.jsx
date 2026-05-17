import { useState, useEffect } from 'react';
import { profileService } from '@/services/api';

export default function Profile() {
  // State untuk menyimpan data asli dari database
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    phone: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Tambahan: state untuk efek loading

  // Fungsi untuk mengetuk pintu backend dan minta data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Asumsinya endpoint backend kamu adalah /api/profile
        const response = await profileService.get();
        
        // Memasukkan data asli dari backend ke state React
        if (response.data) {
          setUser({
            name: response.data.name || '',
            email: response.data.email || '',
            role: response.data.role || 'Pelamar',
            bio: response.data.bio || '',
            phone: response.data.phone || ''
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        // Kalau gagal/belum login, biarkan kosong atau tampilkan error
      } finally {
        setIsLoading(false); // Matikan efek loading kalau sudah selesai
      }
    };

    fetchProfileData();
  }, []); // Kurung siku kosong artinya fungsi ini cuma jalan 1x saat halaman dibuka

 const handleSave = async () => {
    try {
      // KITA FILTER DATANYA DI SINI
      // Hanya bungkus data yang memang ada di tabel jobseeker_profiles
      const profileDataYangDikirim = {
        phone: user.phone,
        bio: user.bio
        // Kalau nanti di database ada kolom 'address' atau 'skills', tambahkan di sini
      };

      // Kirim data yang sudah difilter saja
      await profileService.update(profileDataYangDikirim); 
      
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      const alasanError = error.response?.data?.message || error.message;
      alert("Gagal menyimpan! Alasan: " + alasanError);
      console.error("Detail error:", error);
    }
  };
  // Kalau data masih dijemput dari backend, tampilkan tulisan loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-neutral-500 font-medium">Sedang memuat data dari database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Profil Saya</h1>
        <p className="text-neutral-500">Kelola informasi pribadi, kontak, dan dokumen pendukung kamu.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        
        <div className="px-6 sm:px-8 relative">
          <div className="-mt-12 mb-8 flex justify-between items-end">
            <div className="h-24 w-24 bg-white rounded-full p-1.5 shadow-md">
              <div className="h-full w-full bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 text-3xl font-bold uppercase">
                {user.name ? user.name.charAt(0) : '?'}
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                isEditing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {isEditing ? 'Simpan Profil' : 'Edit Profil'}
            </button>
          </div>

          <div className="space-y-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    isEditing ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed'
                  } transition-all outline-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    isEditing ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed'
                  } transition-all outline-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nomor Handphone</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    isEditing ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed'
                  } transition-all outline-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tipe Akun</label>
                <select
                  disabled={!isEditing}
                  value={user.role || ""}
                  onChange={(e) => setUser({...user, role: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    isEditing 
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-white text-neutral-900 cursor-pointer' 
                      : 'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed'
                  } transition-all outline-none`}
                >
                  <option value="" disabled>Pilih Tipe Akun...</option>
                  <option value="Pelamar">Pelamar</option>
                  <option value="HRD">HRD / Perusahaan</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tentang Saya</label>
              <textarea
                disabled={!isEditing}
                rows="4"
                value={user.bio}
                onChange={(e) => setUser({...user, bio: e.target.value})}
                className={`w-full p-3 rounded-lg border ${
                  isEditing ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed'
                } transition-all outline-none resize-none`}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}