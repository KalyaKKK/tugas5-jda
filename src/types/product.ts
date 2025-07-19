export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  description: string
  price: string
  category: string
}