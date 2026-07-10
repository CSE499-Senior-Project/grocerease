export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Welcome to <span className="text-brand-primary">GrocerEase</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Fresh groceries delivered directly to your door. Your Next.js and Tailwind v4 setup is working perfectly!
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="bg-brand-primary hover:bg-brand-dark text-surface font-semibold py-3 px-8 rounded-lg transition-colors">
            Start Shopping
          </button>
          <button className="bg-brand-light text-brand-dark font-semibold py-3 px-8 rounded-lg hover:bg-brand-light/80 transition-colors">
            Merchant Login
          </button>
        </div>
      </div>
    </main>
  );
}