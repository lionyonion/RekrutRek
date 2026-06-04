import { X } from "lucide-react";

// ==========================================
// GLOBAL COMPONENT: NotificationModal
// ==========================================
export function NotificationModal({ notif, onClose }) {
  if (!notif) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.bgClass} ${notif.textClass}`}
            >
              {notif.icon}
            </div>
            <h3 className="font-bold text-lg text-[#2C263F]">Detail Pesan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#2C263F]/60" />
          </button>
        </div>

        <div className="p-6">
          <h4 className="text-xl font-black text-[#2C263F] mb-2">{notif.title}</h4>
          <span className="text-xs font-bold text-[#2C263F]/40 block mb-4">
            {notif.time}
          </span>

          <div className="bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl p-4 mb-6">
            <p
              className="text-sm text-[#2C263F]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: notif.desc }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold border border-[#2C263F]/20 text-[#2C263F]/70 hover:bg-[#2C263F]/5 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                alert("Tindakan diproses oleh sistem!");
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-1 ${
                notif.actionBgClass || "bg-[#41644A]"
              }`}
            >
              {notif.actionLabel || "Tindak Lanjuti"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}