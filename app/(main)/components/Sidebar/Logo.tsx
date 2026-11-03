import { RiBankCardLine } from "react-icons/ri";

export default function Logo() {
  return (
    <div className='flex items-center gap-3 xl:px-2 py-1 '>
      <div className='bg-purple-600 p-2.5 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/20'>
        <RiBankCardLine className='text-white size-6 xl:size-8' />
      </div>

      <div className='flex flex-col leading-tight'>
        <h1 className='font-black text-xl tracking-tighter text-slate-900 uppercase'>
          Prop<span className='text-purple-600'>AI</span>
        </h1>
        <span className='text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black'>
          SaaS Dashboard
        </span>
      </div>
    </div>
  )
}
