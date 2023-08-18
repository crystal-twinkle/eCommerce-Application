import config from './api-data';
import checkLocalToken from './check-local-token';

const apiCustomers = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}/customers`;

export default function customer() {
  const OptionalForGet = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  } as RequestInit;

  const OptionalForPost = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: undefined,
    redirect: 'follow',
  } as RequestInit;

  const getById = async (id: string) => {
    const res = await fetch(`${apiCustomers}/${id}`, OptionalForGet);
    return res.json();
  };

  const create = async (email: string, password: string, firstName: string, lastName: string) => {
    await checkLocalToken();
    OptionalForPost.body = JSON.stringify({ email, password, firstName, lastName });
    await fetch(`${apiCustomers}`, OptionalForPost);
  };

  return { getById, create };
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
