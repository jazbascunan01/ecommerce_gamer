export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductStats {
  totalProducts: number;
  totalStock: number;
  totalStockValue: number;
  productsOutOfStock: number;
  averageProductPrice: number;
  highestStockProduct: { name: string; stock: number } | null;
}
