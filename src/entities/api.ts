import ApiNames from '../shared/lib/api-factory/api-names';
import ApiConfig from '../app/api-flow/api-config';

export default class Api {
  protected baseApiUrl: string;

  constructor(public name: ApiNames) {
    this.baseApiUrl = `${ApiConfig.CTP_API_URL}/${ApiConfig.CTP_PROJECT_KEY}`;
  }
}
