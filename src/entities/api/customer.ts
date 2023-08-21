import config from './api-data';
import checkLocalToken from './check-local-token';

const apiCustomers = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/customers`;

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
    const res = await fetch(`${apiCustomers}/${id}`, customerOptional);
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
    const setDefaultAddressBody = {
      version,
      actions: [] as { action: string; addressId: string }[],
    };

    if (setDefaultShippingAddress) {
      setDefaultAddressBody.actions.push({
        action: 'setDefaultShippingAddress',
        addressId: shippingAddressId,
      });
    }

    if (setDefaultBillingAddress) {
      setDefaultAddressBody.actions.push({
        action: 'setDefaultBillingAddress',
        addressId: billingAddressId,
      });
    }
    optionalForPost.body = JSON.stringify(setDefaultAddressBody);
    await fetch(`${apiCustomers}/${id}`, optionalForPost);
  };

  const deleteById = async (id: string) => {
    await checkLocalToken();
    customerOptional.method = 'DELETE';
    await fetch(`${apiCustomers}/${id}?version=1`, customerOptional);
  };

  return { getById, create, deleteById, addAddress, setDefaultAddress };
}
