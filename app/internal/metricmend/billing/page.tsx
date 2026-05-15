export default function InternalBillingPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Internal Billing
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Review internal billing operations, customer billing state,
          subscriptions, and enterprise account controls.
        </p>

        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-10 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          Internal billing tools coming next.
        </div>
      </section>
    </div>
  );
}