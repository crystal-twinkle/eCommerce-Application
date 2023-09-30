import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  PasswordAuthMiddlewareOptions,
  TokenStore,
} from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import ApiConfig from './api-config';
import ApiTokenCache from '../token-cache';

export class FlowFactory {
  public clientCredentialsFlow: ByProjectKeyRequestBuilder;
  public existingTokenFlow: ByProjectKeyRequestBuilder;
  public passwordFlow: ByProjectKeyRequestBuilder;
  public refreshTokenFlow: ByProjectKeyRequestBuilder;
  public anonymousSessionFlow: ByProjectKeyRequestBuilder;
  public apiTokenCache: ApiTokenCache;

  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: `https://api.${ApiConfig.CTP_REGION}.commercetools.com`,
    fetch,
  };

  constructor() {
    this.apiTokenCache = new ApiTokenCache();
    this.createClientCredentialsFlow();
  }

  public getWorkingFlow(): ByProjectKeyRequestBuilder {
    const tokenStore: TokenStore = JSON.parse(localStorage.getItem('token_store'));

    if (tokenStore?.refreshToken) {
      if (!this.refreshTokenFlow) {
        this.createRefreshTokenFlow(tokenStore.refreshToken);
      }
      return this.refreshTokenFlow;
    }
    return this.clientCredentialsFlow;
  }

  public createRefreshTokenFlow = (refreshToken: string): void => {
    const options = {
      host: `https://auth.${ApiConfig.CTP_REGION}.commercetools.com`,
      projectKey: ApiConfig.CTP_PROJECT_KEY,
      credentials: {
        clientId: ApiConfig.CTP_CLIENT_ID,
        clientSecret: ApiConfig.CTP_CLIENT_SECRET,
      },
      refreshToken,
      tokenCache: this.apiTokenCache,
      scopes: [ApiConfig.CTP_SCOPES],
      fetch,
    };

    const ctpClient = new ClientBuilder()
      .withProjectKey(ApiConfig.CTP_PROJECT_KEY)
      .withRefreshTokenFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.refreshTokenFlow = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ApiConfig.CTP_PROJECT_KEY,
    });
  };

  public createPasswordFlow = (username: string, password: string): void => {
    const projectKey = ApiConfig.CTP_PROJECT_KEY;
    const scopes = [ApiConfig.CTP_SCOPES];

    const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
      host: `https://auth.${ApiConfig.CTP_REGION}.commercetools.com`,
      projectKey,
      credentials: {
        clientId: ApiConfig.CTP_CLIENT_ID,
        clientSecret: ApiConfig.CTP_CLIENT_SECRET,
        user: {
          username,
          password,
        },
      },
      tokenCache: this.apiTokenCache,
      scopes,
      fetch,
    };

    const ctpClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withPasswordFlow(passwordAuthMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.passwordFlow = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ApiConfig.CTP_PROJECT_KEY,
    });
  };

  public createClientCredentialsFlow = (): void => {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: `https://auth.${ApiConfig.CTP_REGION}.commercetools.com`,
      projectKey: ApiConfig.CTP_PROJECT_KEY,
      credentials: {
        clientId: ApiConfig.CTP_CLIENT_ID,
        clientSecret: ApiConfig.CTP_CLIENT_SECRET,
      },
      scopes: [ApiConfig.CTP_SCOPES],
      fetch,
    };

    const ctpClient = new ClientBuilder()
      .withProjectKey(ApiConfig.CTP_PROJECT_KEY)
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.clientCredentialsFlow = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ApiConfig.CTP_PROJECT_KEY,
    });
  };

  public createExistingTokenFlow = (token: string): void => {
    const ctpClient = new ClientBuilder()
      .withProjectKey(ApiConfig.CTP_PROJECT_KEY)
      .withExistingTokenFlow(token, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.existingTokenFlow = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ApiConfig.CTP_PROJECT_KEY,
    });
  };

  public createAnonymousSessionFlow = (): void => {
    const options: AnonymousAuthMiddlewareOptions = {
      host: `https://auth.${ApiConfig.CTP_REGION}.commercetools.com`,
      projectKey: ApiConfig.CTP_PROJECT_KEY,
      credentials: {
        clientId: ApiConfig.CTP_CLIENT_ID,
        clientSecret: ApiConfig.CTP_CLIENT_SECRET,
        // anonymousId: ApiConfig.CTP_ANONYMOUS_ID, // a unique id
      },
      scopes: [ApiConfig.CTP_SCOPES],
      fetch,
    };

    const ctpClient = new ClientBuilder()
      .withProjectKey(ApiConfig.CTP_PROJECT_KEY)
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.anonymousSessionFlow = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ApiConfig.CTP_PROJECT_KEY,
    });
  };
}

const flowFactory = new FlowFactory();

export default flowFactory;
