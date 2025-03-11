export interface Product {
  name: string;
  price: number;
  unitsSold: number;
  image: string;
}

export function getTopProducts(): Product[] {
  return [
    {
      name: 'Essence Mascara',
      price: 49.9,
      unitsSold: 204,
      image:
        'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
    },
    {
      name: 'Eyeshadow Palette',
      price: 34.9,
      unitsSold: 155,
      image:
        'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
    },
    {
      name: 'Powder Canister',
      price: 40.9,
      unitsSold: 120,
      image:
        'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
    },
    {
      name: 'Red Lipstick',
      price: 49.9,
      unitsSold: 204,
      image:
        'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png',
    },
    {
      name: 'Red Nail Polish',
      price: 34.9,
      unitsSold: 155,
      image:
        'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png',
    },
  ];
}
