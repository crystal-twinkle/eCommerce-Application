import getToken from './get-token';

export default async function checkLocalToken() {
  if (!localStorage.getItem('token')) {
    await getToken().access;
  }
}
