import { Page } from './pages';

export interface IRouterLink {
  path: string;
  callback: (id?: string) => void;
}

export interface IParseUrl {
  path?: string;
  resource?: string;
}

export default class Router {
  private readonly notFoundRouterLink: IRouterLink;

  constructor(private routes: IRouterLink[]) {
    this.notFoundRouterLink = this.routes.find((item) => item.path === Page.NOT_FOUND);
    window.addEventListener('DOMContentLoaded', () => {
      this.navigate(this.getCurrentPath());
    });
    window.addEventListener('popstate', this.browserChangeHandler.bind(this));
    window.addEventListener('hashchange', this.browserChangeHandler.bind(this));
  }

  public navigate(url: string, browserChangeEvent?: boolean): void {
    const request: IParseUrl = this.parseURL(url);
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    const route = this.routes.find((item) => item.path === pathForFind) || this.notFoundRouterLink;
    !browserChangeEvent && window.history.pushState({}, '', route.path);
    route.callback();
  }

  private parseURL(url: string): IParseUrl {
    const result: IParseUrl = {};
    const path: string[] = url.split('/');
    [result.path = '', result.resource = ''] = path;
    return result;
  }

  private browserChangeHandler(): void {
    this.navigate(this.getCurrentPath(), true);
  }

  private getCurrentPath(): string {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname.slice(1);
  }
}
