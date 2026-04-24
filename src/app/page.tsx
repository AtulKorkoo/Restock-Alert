'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Restock Alerts</h1>
          <div className="flex gap-4">
            <Link href="/signin" className="px-4 py-2 text-sm hover:text-blue-400">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Never Miss a Restock Again</h2>
        <p className="text-xl text-slate-400 mb-8">
          Real-time alerts for Pokemon TCG, sneakers, gaming consoles, and more.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Start Free Trial
        </Link>
      </div>
    </div>
  )
}
