export interface IRating {
  rate: number;
  count: number;
}

export interface ProductDTO {
  id: number;
  title: string;
  description: string;
  category: ICategory;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: IDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: IAvailabilityStatus;
  reviews: IReview[];
  // returnPolicy: ReturnPolicy;
  minimumOrderQuantity: number;
  // meta: Meta;
  images: string[];
  thumbnail: string;
}

export interface AdminDashboardDTO {
  thumbnail: string;
  title: string;
  category: ICategory;
  inventory: number;
  price: number;
  reviews: IReview[];
  rating: number;
}

export enum ICategory {
  Beauty = 'beauty',
  Fragrances = 'fragrances',
  Furniture = 'furniture',
  Groceries = 'groceries',
  HomeDecoration = 'home-decoration',
  KitchenAccessories = 'kitchen-accessories',
  Laptops = 'laptops',
  MensShirts = 'mens-shirts',
  MensShoes = 'mens-shoes',
  MensWatches = 'mens-watches',
  MobileAccessories = 'mobile-accessories',
  Motorcycle = 'motorcycle',
  SkinCare = 'skin-care',
  Smartphones = 'smartphones',
  SportsAccessories = 'sports-accessories',
  Sunglasses = 'sunglasses',
  Tablets = 'tablets',
  Tops = 'tops',
  Vehicle = 'vehicle',
  WomensBags = 'womens-bags',
  WomensDresses = 'womens-dresses',
  WomensJewellery = 'womens-jewellery',
  WomensShoes = 'womens-shoes',
  WomensWatches = 'womens-watches',
}

export enum IAvailabilityStatus {
  InStock = 'In Stock',
  OutOfStock = 'Out of Stock',
}

export interface IDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface IReview {
  rating: number;
  comment: string;
  date: Date;
  reviewerName: string;
  reviewerEmail: string;
}

// New interfaces for product filtering and sorting
export interface IProductFilters {
  category?: string | null;
  search?: string | null;
  sort?: string | null;
  page: number;
  itemsPerPage: number;
}

export interface IFilterConflictResult {
  hasConflict: boolean;
  resolvedFilters?: IProductFilters;
}
