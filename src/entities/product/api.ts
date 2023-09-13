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
import store from '../../app/store';

export default class ProductApi {
  public static async getProductProjections(
    offset: number,
    limit: number,
    filterParams: IProductsFilterParams = {},
    sort: string[] = [],
    search?: string,
    resetProductsStore?: boolean,
  ): Promise<ProductProjection[]> {
    const queryArgs: Record<string, QueryParam> = {
      offset,
      limit,
      priceCurrency: 'USD',
      priceCountry: 'US',
      fuzzy: true,
    };

    if (filterParams.categoryId) {
      queryArgs.filter = `categories.id:"${filterParams.categoryId}"`;
    }
    if (filterParams.price) {
      queryArgs['filter.query'] = `variants.price.centAmount:range ${filterParams.price}`;
    }
    if (search && search !== '') {
      queryArgs['text.en-US'] = search;
    }
    if (sort.length) {
      queryArgs.sort = sort;
    }

    const response: ClientResponse<ProductProjectionPagedQueryResponse> = await flowFactory.clientCredentialsFlow
      .productProjections()
      .search()
      .get({ queryArgs })
      .execute();

    store.setProducts(response.body, !resetProductsStore);
    return store.products.results;
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
