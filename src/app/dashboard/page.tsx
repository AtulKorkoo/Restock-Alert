'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'

type Product = {
  id: string
  name: string
  retail_price: number
  secondary_price: number
  photo_url: string
  description: string
}

type UserAlert = {
  id: string
  product_id: string
}

export default function DashboardPage() {
  const [catalog, setCatalog] = useState<Product[]>([])
  const [userAlerts, setUserAlerts] = useState<UserAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const supabase = createClient()

  const FREE_TIER_LIMIT = 3

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const { data: catalogData } = await supabase
        .from('products_catalog')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: alertsData } = await supabase
        .from('user_alerts')
        .select('id, product_id')
        .eq('user_id', user?.id)

      setCatalog(catalogData || [])
      setUserAlerts(alertsData || [])
    } catch (err) {
      console.error('Failed to load:', err)
    } finally {
      setLoading(false)
    }
  }

  const isTracking = (productId: string) =>
    userAlerts.some((a) => a.product_id === productId)

  const handleToggleAlert = async (productId: string) => {
    if (isTracking(productId)) {
      const alert = userAlerts.find((a) => a.product_id === productId)
      if (alert) {
        await supabase.from('user_alerts').delete().eq('id', alert.id)
      }
    } else {
      if (userAlerts.length >= FREE_TIER_LIMIT) {
        setShowUpgradeModal(true)
        return
      }
      await supabase.from('user_alerts').insert({
        user_id: user?.id,
        product_id: productId,
        retailers: ['Chaos Cards', 'Magic Madhouse'],
      })
    }
    await loadData()
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) return null

  const potentialSavings = catalog
    .filter((p) => isTracking(p.id))
    .reduce((sum, p) => sum + (p.secondary_price - p.retail_price), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-2">Ready to catch more?</h3>
              <p className="text-slate-400 mb-6">
                You've hit the free tier limit. Upgrade to track unlimited products.
              </p>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400">Free</span>
                  <span className="font-medium">3 products</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-medium">Pro</span>
                  <span className="font-bold text-green-400">Unlimited</span>
                </div>
              </div>

              <div className="text-3xl font-bold mb-1">£4.99<span className="text-base text-slate-400 font-normal">/month</span></div>
              <p className="text-xs text-slate-500 mb-6">Cancel anytime</p>

              <button
                onClick={() => alert('Stripe checkout coming soon!')}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium mb-3 transition"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full px-4 py-2 text-slate-400 hover:text-white transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Restock Alerts</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.email}</span>
            <button onClick={() => signOut()} className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">🎯 Potential Savings</div>
            <div className="text-3xl font-bold text-green-400">£{potentialSavings.toFixed(0)}</div>
            <div className="text-xs text-slate-500 mt-2">
              If you catch all your tracked products
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">📦 Tracking</div>
            <div className="text-3xl font-bold">{userAlerts.length}<span className="text-lg text-slate-500">/{FREE_TIER_LIMIT}</span></div>
            <div className="text-xs text-slate-500 mt-2">products on Free tier</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">⚡ Plan</div>
            <div className="text-3xl font-bold">Free</div>
            <div className="text-xs text-slate-500 mt-2">Upgrade for unlimited</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">🔥 Hot Pokemon Products</h2>
        <p className="text-sm text-slate-400 mb-6">
          Click to track. We'll alert you when these restock.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catalog.map((product) => {
            const tracking = isTracking(product.id)
            const savings = product.secondary_price - product.retail_price
            return (
              <div
                key={product.id}
                className={`bg-slate-800 rounded-lg p-6 border-2 transition ${
                  tracking ? 'border-green-500' : 'border-slate-700'
                }`}
              >
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div>
                    <div className="text-slate-500">Retail</div>
                    <div className="text-xl font-bold">£{product.retail_price}</div>
                  </div>
                  <div className="text-slate-600">→</div>
                  <div>
                    <div className="text-slate-500">Secondary</div>
                    <div className="text-xl font-bold text-green-400">£{product.secondary_price}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Save</div>
                    <div className="text-xl font-bold text-green-400">£{savings}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAlert(product.id)}
                  className={`w-full px-4 py-2 rounded font-medium transition ${
                    tracking
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {tracking ? '✓ Tracking' : '+ Track this product'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
