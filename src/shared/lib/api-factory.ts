import Api from '../../entities/api';

export class ApiFactory {
  private apiMap: Map<string, Api> = new Map<string, Api>();

  public registerApi(APIs: Api[]): void {
    APIs?.forEach((api) => this.apiMap.set(api.name, api));
  }

  public getApi(name: string): Api {
    return this.apiMap.get(name);
  }
}

const apiFactory: ApiFactory = new ApiFactory();

export default apiFactory;
