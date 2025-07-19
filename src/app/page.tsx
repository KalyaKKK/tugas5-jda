'use client'

import { useState, useEffect } from 'react'
import { Product, ProductFormData } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import ProductForm from '@/components/ProductForm'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle create product
  const handleCreateProduct = async (formData: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProducts()
        setShowForm(false)
      } else {
        alert('Gagal menambahkan produk')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Terjadi kesalahan saat menambahkan produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update product
  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!editingProduct) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProducts()
        setEditingProduct(null)
        setShowForm(false)
      } else {
        alert('Gagal mengupdate produk')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Terjadi kesalahan saat mengupdate produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProducts()
      } else {
        alert('Gagal menghapus produk')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Terjadi kesalahan saat menghapus produk')
    }
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
            <p className="text-gray-600 mt-2">Kelola produk Anda dengan mudah</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Tambah Produk
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Belum ada produk</h3>
            <p className="text-gray-500 mb-6">Mulai dengan menambahkan produk pertama Anda</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Tambah Produk Pertama
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
