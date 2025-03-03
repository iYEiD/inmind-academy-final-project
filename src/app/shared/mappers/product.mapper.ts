import { ProductDTO, AdminDashboardDTO } from '../../models/product.model';

export interface HomeProductsView {
  topRated: ProductDTO[];
  exploreProducts: ProductDTO[];
}

export class ProductMapper {
  static toAdminDashboard(product: ProductDTO): AdminDashboardDTO {
    return {
      thumbnail: product.thumbnail,
      title: product.title,
      category: product.category,
      inventory: product.stock,
      price: product.price,
      reviews: product.reviews,
      rating: product.rating,
    };
  }

  static toAdminDashboardList(products: ProductDTO[]): AdminDashboardDTO[] {
    return products.map((product) => this.toAdminDashboard(product));
  }

  static toHomeView(products: ProductDTO[]): HomeProductsView {
    return {
      topRated: products.slice(0, 4),
      exploreProducts: products.slice(4, 12),
    };
  }
}
