
interface BillingProps {
  plan: string;
}

export default function BillingSection({ plan }: BillingProps) {
  return (
    <section className="bg-white/90 p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 mt-10">
      <h2 className=" text-2xl font-bold text-slate-500  uppercase tracking-wide leading-relaxed max-w-md">Comming soon.</h2>
    </section>
  )
}
