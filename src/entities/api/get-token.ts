import config from './api-data';

interface IToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export default function getToken() {
  const base64Auth = btoa(`${config.CTP_CLIENT_ID}:${config.CTP_CLIENT_SECRET}`);
  const basicOptional = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Auth}`,
    },
    body: '',
    redirect: 'follow',
  } as RequestInit;

  const anonymous = async (): Promise<IToken> => {
    const response = await fetch(
      `${config.CTP_AUTH_URL}/oauth/${config.CTP_PROJECT_KEY}/anonymous/token?grant_type=client_credentials`,
      basicOptional,
    );
    return response.json();
  };

  const access = async () => {
    const response = await fetch(`${config.CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`, basicOptional);
    const result: IToken = await response.json();
    localStorage.setItem('token', result.access_token);
  };

  return { access, anonymous };
}
