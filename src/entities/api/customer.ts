import config from './api-data';
import checkLocalToken from './check-local-token';

const apiCustomers = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/customers`;

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

  const addAddress = async (id: string, version: number, addAddressBody: string[]) => {
    const [email, firstName, lastName, postalCode, city, street, country] = addAddressBody;
    const generateRandomKey = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const randomIndex = () => Math.floor(Math.random() * characters.length);
      return Array.from({ length: 7 }, () => characters[randomIndex()]).join('');
    };
    const setDefaultAddressBody = {
      version,
      actions: [
        {
          action: 'addAddress',
          key: generateRandomKey(),
          title: 'My Address',
          firstName,
          lastName,
          streetName: street,
          streetNumber: '4711',
          postalCode,
          city,
          region: 'America',
          state: 'default',
          country,
          email,
        },
      ],
    };
    optionalForPost.body = JSON.stringify(setDefaultAddressBody);
    await fetch(`${apiCustomers}/${id}`, optionalForPost);
  };

  const create = async (customerBody: string[]) => {
    const [email, password, firstName, lastName] = customerBody;
    await checkLocalToken();
    optionalForPost.body = JSON.stringify(JSON.stringify({ email, password, firstName, lastName }));
    console.log(optionalForPost.body);
    const response = await fetch(`${apiCustomers}`, optionalForPost);
    return response.json();
  };

  // const create = async (email: string, password: string, firstName: string, lastName: string) => {
  //   await checkLocalToken();
  //   optionalForPost.body = JSON.stringify({ email, password, firstName, lastName });
  //   const response = await fetch(`${apiCustomers}`, optionalForPost);
  //   return response.json();
  // };

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

export const getCustomers = async () => {
  await checkLocalToken();
  const response = await fetch(`${apiCustomers}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  });
  return response.json();
};

// customer().addAddress(['some@qqq', 'firstName', 'lastName', 'postalCode', 'city', 'street', 'country']);
// console.log(createRequestBody.addresses.length);
// customer().addAddress(['some@qqq', 'firstName', 'lastName', 'postalCode', 'city', 'street', 'country']);
// console.log(createRequestBody.addresses.length);
// customer().create(['dasaa@asa.com', 'dashuahhsoa', 'asas', 'asasa']);
console.log(getCustomers());
