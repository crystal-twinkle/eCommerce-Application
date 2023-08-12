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
  }

  public navigate(url: string): void {
    const request: IParseUrl = this.parseURL(url);
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    const route = this.routes.find((item) => item.path === pathForFind) || this.notFoundRouterLink;
    route.callback();
  }

  public parseURL(url: string): IParseUrl {
    const result: IParseUrl = {};
    const path: string[] = url.split('/');
    [result.path = '', result.resource = ''] = path;
    return result;
  }
}
