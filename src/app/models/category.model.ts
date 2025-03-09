export interface ICategory {
  name: string;
  link: string;
}

export interface ICategorySection {
  title: string;
  isOpen: boolean;
  categories: ICategory[];
}

export interface INavItem {
  name: string;
  link: string;
  sections?: {
    title: string;
    categories: ICategory[];
  }[];
}

export const CATEGORY_SECTIONS: ICategorySection[] = [
  {
    title: 'Electronics',
    isOpen: false,
    categories: [
      { name: 'Smartphones', link: '/products/smartphones' },
      { name: 'Laptops', link: '/products/laptops' },
      { name: 'Tablets', link: '/products/tablets' },
      { name: 'Mobile Accessories', link: '/products/mobile-accessories' },
    ],
  },
  {
    title: 'Fashion',
    isOpen: false,
    categories: [
      { name: "Men's Shirts", link: '/products/mens-shirts' },
      { name: "Men's Shoes", link: '/products/mens-shoes' },
      { name: "Men's Watches", link: '/products/mens-watches' },
      { name: "Women's Dresses", link: '/products/womens-dresses' },
      { name: "Women's Bags", link: '/products/womens-bags' },
      { name: "Women's Jewellery", link: '/products/womens-jewellery' },
      { name: "Women's Shoes", link: '/products/womens-shoes' },
      { name: "Women's Watches", link: '/products/womens-watches' },
    ],
  },
  {
    title: 'Home & Living',
    isOpen: false,
    categories: [
      { name: 'Furniture', link: '/products/furniture' },
      { name: 'Home Decoration', link: '/products/home-decoration' },
      { name: 'Kitchen Accessories', link: '/products/kitchen-accessories' },
    ],
  },
  {
    title: 'Lifestyle',
    isOpen: false,
    categories: [
      { name: 'Beauty', link: '/products/beauty' },
      { name: 'Fragrances', link: '/products/fragrances' },
      { name: 'Skin Care', link: '/products/skin-care' },
      { name: 'Sunglasses', link: '/products/sunglasses' },
    ],
  },
  {
    title: 'Sports & Outdoors',
    isOpen: false,
    categories: [
      { name: 'Sports Accessories', link: '/products/sports-accessories' },
      { name: 'Motorcycle', link: '/products/motorcycle' },
      { name: 'Vehicle', link: '/products/vehicle' },
    ],
  },
];

export const NAV_ITEMS: INavItem[] = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Our Sections',
    link: '#',
    sections: CATEGORY_SECTIONS,
  },
  {
    name: 'Shop Now',
    link: '/products',
  },
];
