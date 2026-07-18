import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  // Initialize the Supabase client using your server-side helper
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Ping the authentication service to test the connection
  const { error } = await supabase.auth.getSession()

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
        Welcome to <span className="text-brand-primary">GrocerEase</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Fresh groceries delivered directly to your door.
      </p>        
      <div className="flex gap-4 justify-center">
        <button className="bg-brand-primary hover:bg-brand-dark text-surface font-semibold py-3 px-8 rounded-lg transition-colors">
          Start Shopping
        </button>
        <button className="bg-brand-light text-brand-dark font-semibold py-3 px-8 rounded-lg hover:bg-brand-light/80 transition-colors">
          Merchant Login
        </button>
      </div>
      {error ? (
      <div style={{ color: '#ff4d4f', marginTop: '1rem' }}>
        <h2>Connection Failed ❌</h2>
        <p>{error.message}</p>
      </div>
      ) : (
      <div style={{ color: '#52c41a', marginTop: '1rem' }}>
        <h2>Connected Successfully! ✅</h2>
        <p>The Next.js frontend is actively talking to our Supabase backend.</p>
      </div>
      )}
    </div>
  );
}