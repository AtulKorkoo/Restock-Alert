'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'

type Product = {
  id: string
  product_name: string
  retailer_url: string
  created_at: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ product_name: '', retailer_url: '' })
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('products').insert({
        product_name: formData.product_name,
        retailer_url: formData.retailer_url,
        user_id: user?.id,
      })
      if (error) throw error
      setFormData({ product_name: '', retailer_url: '' })
      setShowForm(false)
      await loadProducts()
    } catch (err) {
      console.error('Failed to add product:', err)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      await loadProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
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
          <div className="bg-slate-800 rounded p-4 border border-slate-700">
            <div className="text-sm text-slate-400">Monitoring</div>
            <div className="text-3xl font-bold">{products.length}</div>
            <div className="text-xs text-slate-500">products</div>
          </div>
          <div className="bg-slate-800 rounded p-4 border border-slate-700">
            <div className="text-sm text-slate-400">Plan</div>
            <div className="text-3xl font-bold">Free</div>
            <div className="text-xs text-slate-500">5 product limit</div>
          </div>
          <div className="bg-slate-800 rounded p-4 border border-slate-700">
            <div className="text-sm text-slate-400">Alerts</div>
            <div className="text-3xl font-bold">Email</div>
            <div className="text-xs text-slate-500">Configured</div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Monitored Products</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded p-6 border border-slate-700 mb-6">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g., Pokemon Booster Box"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Retailer URL</label>
                <input
                  type="url"
                  value={formData.retailer_url}
                  onChange={(e) => setFormData({ ...formData, retailer_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium">
                Add Product
              </button>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-slate-800 rounded p-8 border border-slate-700 text-center">
            <p className="text-slate-400">No products monitored yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-800 rounded p-4 border border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{product.product_name}</h3>
                  <p className="text-sm text-slate-400 truncate">{product.retailer_url}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
