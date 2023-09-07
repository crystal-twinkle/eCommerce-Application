import { ID_SELECTOR, Page } from './pages';

export interface IRouterLink {
  path: string;
  callback: (id?: string) => void;
}

export interface IParseUrl {
  path?: string;
  resource?: string;
}

enum NavigateType {
  DEFAULT,
  CONTENT_LOADED,
  BROWSER_CHANGE_EVENT,
}

export class Router {
  private notFoundRouterLink: IRouterLink;
  private overviewLink: IRouterLink;
  private routes: IRouterLink[];

  public setRoutes(routes: IRouterLink[]): void {
    this.routes = routes;
    this.notFoundRouterLink = this.routes.find((item: IRouterLink) => item.path === Page.NOT_FOUND);
    this.overviewLink = this.routes.find((item: IRouterLink) => item.path === Page.OVERVIEW);
    window.addEventListener('DOMContentLoaded', () => {
      this.navigate(this.getCurrentPath(), NavigateType.CONTENT_LOADED);
    });
    window.addEventListener('popstate', this.browserChangeHandler.bind(this));
    window.addEventListener('hashchange', this.browserChangeHandler.bind(this));
  }

  public navigate(url: string, browserChangeEvent: NavigateType = NavigateType.DEFAULT): void {
    const request: IParseUrl = this.parseURL(url);
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${ID_SELECTOR}`;
    const route = this.isDisabledRoute(url)
      ? this.overviewLink
      : this.routes.find((item: IRouterLink) => item.path === pathForFind) || this.notFoundRouterLink;

    if (route === this.notFoundRouterLink) {
      window.history.pushState({}, '', route.path || '/');
    } else if (browserChangeEvent === NavigateType.DEFAULT) {
      window.history.pushState({}, '', request.resource ? `${request.path}/${request.resource}` : route.path || '/');
    }
    route.callback(request.resource);
  }

  private isDisabledRoute(url: string): boolean {
    return localStorage.getItem('token_store')
      ? url === Page.LOGIN || url === Page.REGISTRATION
      : url === Page.USER_PROFILE;
  }

  private parseURL(url: string): IParseUrl {
    const result: IParseUrl = {};
    const path: string[] = url.split('/');
    [result.path = '', result.resource = ''] = path;
    return result;
  }

  private browserChangeHandler(): void {
    this.navigate(this.getCurrentPath(), NavigateType.BROWSER_CHANGE_EVENT);
  }

  public getCurrentPath(): string {
    return window.location.hash ? window.location.hash.slice(1) : window.location.pathname.slice(1);
  }
}

const appRouter: Router = new Router();

export default appRouter;
