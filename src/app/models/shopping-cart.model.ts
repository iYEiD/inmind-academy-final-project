export interface ICartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface ICart {
  items: ICartItem[];
  totalPrice: number;
}
