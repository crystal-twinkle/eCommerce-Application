import config from './api-data';
import checkLocalToken from './check-local-token';

const apiUrl = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}`;

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
    const res = await fetch(`${apiUrl}/${id}`, OptionalForGet);
    return res.json();
  };

  const getByEmail = async (email: string) => {
    await checkLocalToken();
    const res = await fetch(`${apiUrl}/${email}`, OptionalForGet);
    return res.json();
  };

  const create = async (email: string, password: string, firstName: string, lastName: string) => {
    await checkLocalToken();
    OptionalForPost.body = JSON.stringify({ email, password, firstName, lastName });
    await fetch(`${apiUrl}/customers`, OptionalForPost);
  };

  return { getById, getByEmail, create };
}

export const getCustomers = async () => {
  await checkLocalToken();
  const response = await fetch(`${apiUrl}/customers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  });
  return response.json();
};
