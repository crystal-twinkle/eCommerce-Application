import { Page } from './pages';

export interface IRouterLink {
  path: string;
  callback: (id?: string) => void;
}

export interface IParseUrl {
  path?: string;
  resource?: string;
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
      this.navigate(this.getCurrentPath());
    });
    window.addEventListener('popstate', this.browserChangeHandler.bind(this));
    window.addEventListener('hashchange', this.browserChangeHandler.bind(this));
  }

  public navigate(url: string, browserChangeEvent?: boolean): void {
    const request: IParseUrl = this.parseURL(url);
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    const route =
      localStorage.getItem('customerData') && (url === Page.LOGIN || url === Page.REGISTRATION)
        ? this.overviewLink
        : this.routes.find((item) => item.path === pathForFind) || this.notFoundRouterLink;

    !browserChangeEvent && window.history.pushState({}, '', route.path || '/');
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

const appRouter: Router = new Router();

export default appRouter;
