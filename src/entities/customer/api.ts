import config from '../api/api-data';
import { Customer, IAddressCreate } from './models';
import Api from '../api';
import checkLocalToken from '../api/check-local-token';
import { ApiNames } from '../../shared/lib/api-factory/api-names';
import ListResponse from '../models';

const apiCustomers: string = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/customers`;

export const addressesCreate: IAddressCreate[] = [];

export default class CustomerAPI extends Api {
  private customerOptional: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  };

  private optionalForPost: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: undefined,
    redirect: 'follow',
  };
  addresses: IAddressCreate[] = [];
  constructor() {
    super(ApiNames.CUSTOMER);
  }

  public getById = async (id: string) => {
    const res = await fetch(`${apiCustomers}/${id}`, this.customerOptional);
    return res.json();
  };

  public getByEmail = async (email: string): Promise<ListResponse<Customer>> => {
    const res = await fetch(`${apiCustomers}/?where=email%3D%22${email}%22`, this.customerOptional);
    return res.json();
  };

  public login = async (email: string, password: string) => {
    await checkLocalToken();
    this.optionalForPost.body = JSON.stringify({
      email,
      password,
    });
    const res = await fetch(`${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/login`, this.optionalForPost);
    return res.json();
  };

  public addAddress(address: string[]): void {
    const [email, firstName, lastName, postalCode, city, street] = address;
    const generateRandomKey = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const randomIndex = () => Math.floor(Math.random() * characters.length);
      return Array.from({ length: 7 }, () => characters[randomIndex()]).join('');
    };
    const setDefaultAddressBody = {
      key: generateRandomKey(),
      title: 'My Address',
      firstName,
      lastName,
      streetName: street,
      postalCode,
      city,
      region: 'America',
      country: 'DE',
      email,
    };
    this.addresses.push(setDefaultAddressBody);
    console.log(this.addresses);
    addressesCreate.push(setDefaultAddressBody);
  }

  public create = async (email: string, password: string, firstName: string, lastName: string) => {
    await checkLocalToken();
    this.optionalForPost.body = JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      addresses: [...addressesCreate],
    });
    const response = await fetch(`${apiCustomers}`, this.optionalForPost);
    return response.json();
  };

  public setDefaultAddress = async (id: string, version: number, defaultAddress: boolean[], addressIds: string[]) => {
    const [setDefaultShippingAddress, setDefaultBillingAddress] = defaultAddress;
    const [shippingAddressId, billingAddressId] = addressIds;

    const setAddressBody = {
      version,
      actions: [] as { action: string; addressId: string }[],
    };
    if (!setDefaultShippingAddress) {
      setAddressBody.actions.push({
        action: 'addShippingAddressId',
        addressId: shippingAddressId,
      });
    }
    if (!setDefaultBillingAddress) {
      setAddressBody.actions.push({
        action: 'addBillingAddressId',
        addressId: billingAddressId,
      });
    }
    if (setDefaultShippingAddress) {
      setAddressBody.actions.push({
        action: 'setDefaultShippingAddress',
        addressId: shippingAddressId,
      });
    }

    if (setDefaultBillingAddress) {
      setAddressBody.actions.push({
        action: 'setDefaultBillingAddress',
        addressId: billingAddressId,
      });
    }
    this.optionalForPost.body = JSON.stringify(setAddressBody);
    await fetch(`${apiCustomers}/${id}`, this.optionalForPost);
  };

  public deleteById = async (id: string) => {
    await checkLocalToken();
    this.customerOptional.method = 'DELETE';
    await fetch(`${apiCustomers}/${id}?version=1`, this.customerOptional);
  };

  public getCustomers = async () => {
    await checkLocalToken();
    const response = await fetch(`${apiCustomers}?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      redirect: 'follow',
    });
    return response.json();
  };
}
// const customerAPI: CustomerAPI = apiFactory.getApi('customerAPI') as CustomerAPI;
// customerAPI.addAddress(['basic@ver.com', 'aaaa', 'cccc', 'sasf', 'sasaee', '12345']);
