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

export enum ICategory {
  Beauty = 'beauty',
  Fragrances = 'fragrances',
  Furniture = 'furniture',
  Groceries = 'groceries',
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
