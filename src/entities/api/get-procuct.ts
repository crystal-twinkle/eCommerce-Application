import apiData from './api-data';
import getToken from './get-token';

export default async function getProduct(productKey: string): Promise<void> {
  // const baseUrl =

  // const base64Auth = btoa(`${apiData.CTP_CLIENT_ID}:${apiData.CTP_CLIENT_SECRET}`);
  const basicOptional: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    redirect: 'follow',
  };
  const response = await fetch(
    // `${apiData.CTP_API_URL}${apiData.CTP_PROJECT_KEY}/products/key/${productKey}`,
    'https://api.europe-west1.gcp.commercetools.com/rss-school-ecommerce-application/products/d991cc27-ea91-4950-a175-94683d20c623',
    basicOptional,
  );

  console.log(await response.json());
  console.log(localStorage.getItem('token'));
}
