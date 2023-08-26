import { AuthMiddlewareOptions, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ApiConfig from './api-config';

const projectKey = ApiConfig.CTP_PROJECT_KEY;
const scopes = [ApiConfig.CTP_SCOPES];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `https://auth.${ApiConfig.CTP_REGION}.commercetools.com`,
  projectKey,
  credentials: {
    clientId: ApiConfig.CTP_CLIENT_ID,
    clientSecret: ApiConfig.CTP_CLIENT_SECRET,
  },
  scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `https://api.${ApiConfig.CTP_REGION}.commercetools.com`,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: ApiConfig.CTP_PROJECT_KEY,
});

export default apiRoot;
