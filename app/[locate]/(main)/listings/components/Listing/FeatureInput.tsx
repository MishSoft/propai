interface FeatureInputProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
}

export default function FeatureInput({ id, label, icon, placeholder = "0" }: FeatureInputProps) {
  return (
    <div className='flex flex-col gap-2.5 items-center'>
      <label
        className='flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter'
        htmlFor={id}
      >
        {icon}
      </label>
      <input
        required
        id={id}
        type="number"
        placeholder={placeholder}
        className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 text-center font-black text-slate-700 transition-all focus:bg-white'
      />
      <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
        {label}
      </span>
    </div>
  )
}
