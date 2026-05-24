export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartProductPayload {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartPayload {
  userId: number;
  products: CartProductPayload[];
}
