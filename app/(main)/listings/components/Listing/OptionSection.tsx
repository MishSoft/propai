import React from 'react';

interface Props {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon?: React.ReactNode; // დავამატეთ იკონკის პროპი
}

export const ListingSelect: React.FC<Props> = ({ label, name, options, value, onChange, icon }: Props) => {
  return (
    <div className="relative group w-full flex flex-col gap-2">
      {/* ლეიბლი შენი დიზაინის სტილში */}
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>

      <div className="relative flex items-center">
        {/* იკონკა თუ გადმოეცემა */}
        {icon && (
          <span className="absolute left-4 text-slate-400 group-focus-within:text-purple-600 transition-colors">
            {icon}
          </span>
        )}

        <select
          name={name}
          id={name} // საჭიროა getElementById-სთვის, თუ ისევ იმ მეთოდს იყენებ
          value={value}
          onChange={onChange}
          className={`w-full py-4 ${icon ? 'pl-12' : 'pl-5'} pr-10 bg-slate-50 border border-slate-200 outline-none rounded-2xl text-[13px] font-bold text-slate-700 appearance-none focus:border-purple-400 focus:bg-white transition-all cursor-pointer`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* ლამაზი ისარი მარჯვნივ */}
        <div className="absolute right-4 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
