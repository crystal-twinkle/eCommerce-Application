import Api from '../api';
import { Product } from './models';
import { ApiNames } from '../../shared/lib/api-factory/api-names';
import ListResponse from '../models';

export default class ProductAPI extends Api {
  constructor() {
    super(ApiNames.PRODUCTS);
  }

  public getProducts = async (): Promise<ListResponse<Product>> => {
    const res = await fetch(`${this.baseApiUrl}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      redirect: 'follow',
    });

    return res.json();
  };
}
