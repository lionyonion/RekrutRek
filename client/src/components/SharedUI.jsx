import React from "react";

// ==========================================
// SHARED COMPONENT: InputField
// ==========================================
export function InputField({
  label,
  name,
  type = "text",
  icon,
  onChange,
  defaultValue,
  value,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-[#2C263F] placeholder-[#2C263F]/30 focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all ${
            disabled
              ? "bg-[#2C263F]/5 border-[#2C263F]/5 cursor-not-allowed opacity-70"
              : "bg-white border-[#2C263F]/10"
          }`}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// ==========================================
// SHARED COMPONENT: MenuButton (Sidebar)
// ==========================================
export function MenuButton({ icon, label, isActive, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${
        isActive
          ? "bg-[#41644A] text-[#FDFBF7] shadow-md"
          : "text-[#2C263F]/60 hover:bg-[#2C263F]/5 hover:text-[#2C263F]"
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        {label}
      </div>
      {badge && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            isActive ? "bg-[#F8C662] text-[#2C263F]" : "bg-red-500 text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function MobileMenuButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 p-2 rounded-xl transition-colors ${
        isActive ? "text-[#41644A]" : "text-[#2C263F]/40"
      }`}
    >
      {React.cloneElement(icon, {
        className: `w-6 h-6 mb-1 ${isActive ? "stroke-2" : "stroke-[1.5]"}`,
      })}
      <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
        {label}
      </span>
    </button>
  );
}