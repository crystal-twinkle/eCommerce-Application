import { TokenCacheOptions, TokenStore } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

export default class ApiTokenCache {
  public tokenStore: TokenStore;

  public get = (tokenCacheOptions?: TokenCacheOptions) => this.tokenStore;

  public set = (cache: TokenStore, tokenCacheOptions?: TokenCacheOptions) => {
    const existingTokenStore: string = localStorage.getItem('token_store');
    if (existingTokenStore) {
      const existingParseTokenStore = JSON.parse(existingTokenStore);
      const refreshToken: string = cache.refreshToken || existingParseTokenStore.refreshToken;

      localStorage.setItem(
        'token_store',
        JSON.stringify({
          ...cache,
          refreshToken,
        }),
      );
    } else {
      localStorage.setItem('token_store', JSON.stringify(cache));
    }
  };
}
