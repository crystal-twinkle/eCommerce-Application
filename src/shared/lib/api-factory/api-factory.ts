import Api from '../../../entities/api';
import ApiNames from './api-names';

export class ApiFactory {
  private apiMap: Map<ApiNames, Api> = new Map<ApiNames, Api>();

  public registerApi(APIs: Api[]): void {
    APIs?.forEach((api: Api) => this.apiMap.set(api.name, api));
  }

  public getApi(name: ApiNames): Api {
    return this.apiMap.get(name);
  }
}

const apiFactory: ApiFactory = new ApiFactory();

export default apiFactory;
