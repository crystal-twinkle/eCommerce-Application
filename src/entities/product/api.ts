import {
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { CategoryPagedQueryResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/category';
import { Category, Product } from '@commercetools/platform-sdk';
import {
  ClientResponse,
  QueryParam,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/common-types';
import flowFactory from '../../app/api-flow/flow-factory';
import { IProductsFilterParams } from './model';

export default class ProductApi {
  public static async getProducts(
    filterParams: IProductsFilterParams = {},
    sort: string[] = [],
  ): Promise<ProductProjection[]> {
    const queryArgs: Record<string, QueryParam> = {
      priceCurrency: 'USD',
      priceCountry: 'US',
    };
    let filter: string = '';

    if (filterParams.categoryId) {
      filter += ` categories.id:"${filterParams.categoryId}" `;
    }
    if (filterParams.price) {
      filter += ` variants.price.centAmount:range ${filterParams.price} `;
    }
    filter = filter.trim().replace(' ', ',');

    if (filter.length) {
      queryArgs.filter = filter;
    }
    if (sort.length) {
      queryArgs.sort = sort;
    }

    const response: ClientResponse<ProductProjectionPagedQueryResponse> = await flowFactory.clientCredentialsFlow
      .productProjections()
      .search()
      .get({ queryArgs })
      .execute();

    return response.body.results;
  }

  public static async getProduct(ID: string): Promise<Product> {
    const response: ClientResponse<Product> = await flowFactory.clientCredentialsFlow
      .products()
      .withId({ ID })
      .get()
      .execute();
    return response.body;
  }

  public static async getCategories(): Promise<Category[]> {
    const response: ClientResponse<CategoryPagedQueryResponse> = await flowFactory.clientCredentialsFlow
      .categories()
      .get()
      .execute();
    return response.body.results;
  }
}
