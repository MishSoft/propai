interface InputProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function ListingInput({ id, label, icon, type = "text", placeholder, required = true }: InputProps) {
  return (
    <div className='flex flex-col gap-2.5'>
      <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor={id}>
        {icon} {label}
      </label>
      <input
        required={required}
        id={id}
        type={type}
        placeholder={placeholder}
        className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700'
      />
    </div>
  );
}
