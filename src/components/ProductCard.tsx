'use client'

import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      
      {product.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
      )}
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-green-600">
          {formatPrice(product.price)}
        </p>
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        <p>Dibuat: {formatDate(product.createdAt)}</p>
        {product.updatedAt !== product.createdAt && (
          <p>Diupdate: {formatDate(product.updatedAt)}</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>
  )
}