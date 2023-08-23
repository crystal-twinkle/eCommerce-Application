import getToken from './get-token';

export default async function checkLocalToken() {
  await getToken().access();
}

export async function checkLocalTokenAnon() {
  if (!localStorage.getItem('token')) {
    await getToken().anonymous();
  }
}
