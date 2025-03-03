import { Injectable } from '@angular/core';
import { ProductDTO } from '../../models/product.model';
import { ICartItem } from '../../models/shopping-cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartMapper {
  /**
   * Maps a ProductDTO to an ICartItem with default quantity of 1
   */
  mapProductToCartItem(product: ProductDTO): ICartItem {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      thumbnail: product.thumbnail,
    };
  }

  /**
   * Maps a ProductDTO to an ICartItem with custom quantity
   */
  mapProductToCartItemWithQuantity(
    product: ProductDTO,
    quantity: number
  ): ICartItem {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      thumbnail: product.thumbnail,
    };
  }

  /**
   * Maps multiple ProductDTOs to ICartItems
   */
  mapProductsToCartItems(products: ProductDTO[]): ICartItem[] {
    return products.map((product) => this.mapProductToCartItem(product));
  }
}
