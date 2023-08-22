import config from './api-data';
import checkLocalToken from './check-local-token';

const apiCustomers = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/customers`;

export interface IAddress {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  region: string;
  state: string;
  country: string;
  email: string;
}

interface IAddressCreate {
  key: string;
  title: string;
  firstName: string;
  lastName: string;
  streetName: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  email: string;
}

interface ICustomerByEmail {
  count: number;
  limit: number;
  offset: number;
  results: {
    addresses: IAddress[];
    authenticationMode: string;
    billingAddressIds: string[];
    createdAt: string;
    createdBy: {
      clientId: string;
      isPlatformClient: boolean;
    };
    email: string;
    firstName: string;
    id: string;
    lastModifiedBy: {
      clientId: string;
      isPlatformClient: boolean;
    };
    lastName: string;
    password: string;
    shippingAddressIds: string[];
    version: number;
  }[];
  total: 1;
}

export const addressesCreate: IAddressCreate[] = [];

export const getCustomers = async () => {
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

export default function customer() {
  const customerOptional: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  };

  const optionalForPost: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: undefined,
    redirect: 'follow',
  };

  const getById = async (id: string) => {
    await checkLocalToken();
    const res = await fetch(`${apiCustomers}/${id}`, customerOptional);
    return res.json();
  };

  const getByEmail = async (email: string): Promise<ICustomerByEmail> => {
    await checkLocalToken();
    const res = await fetch(`${apiCustomers}/?where=email%3D%22${email}%22`, customerOptional);
    return res.json();
  };

  const login = async (email: string, password: string) => {
    await checkLocalToken();
    optionalForPost.body = JSON.stringify({
      email,
      password,
    });
    const res = await fetch(`${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/login`, optionalForPost);
    return res.json();
  };

  const addAddress = async (address: string[]) => {
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
    addressesCreate.push(setDefaultAddressBody);
  };

  const create = async (email: string, password: string, firstName: string, lastName: string) => {
    await checkLocalToken();
    optionalForPost.body = JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      addresses: [...addressesCreate],
    });
    const response = await fetch(`${apiCustomers}`, optionalForPost);
    return response.json();
  };

  const setDefaultAddress = async (id: string, version: number, defaultAddress: boolean[], addressIds: string[]) => {
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
    optionalForPost.body = JSON.stringify(setAddressBody);
    await fetch(`${apiCustomers}/${id}`, optionalForPost);
    console.log(getById(id));
  };

  const deleteById = async (id: string) => {
    await checkLocalToken();
    customerOptional.method = 'DELETE';
    await fetch(`${apiCustomers}/${id}?version=1`, customerOptional);
  };

  return { getById, getByEmail, create, deleteById, addAddress, setDefaultAddress, login };
}
