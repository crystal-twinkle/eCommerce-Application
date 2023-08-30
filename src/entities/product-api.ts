import { CategoryPagedQueryResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/category';
import { Category, Product, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/common-types';
import flowFactory from '../app/api-flow/flow-factory';

export default class ProductApi {
  public static async getProducts(): Promise<Product[]> {
    const response: ClientResponse<ProductPagedQueryResponse> = await flowFactory
      .getWorkingFlow()
      .products()
      .get()
      .execute();
    return response.body.results;
  }

  public static async getProduct(ID: string): Promise<Product> {
    const response: ClientResponse<Product> = await flowFactory
      .getWorkingFlow()
      .products()
      .withId({ ID })
      .get()
      .execute();
    return response.body;
  }

  public static async getCategories(): Promise<Category[]> {
    const response: ClientResponse<CategoryPagedQueryResponse> = await flowFactory
      .getWorkingFlow()
      .categories()
      .get()
      .execute();
    return response.body.results;
  }
}
