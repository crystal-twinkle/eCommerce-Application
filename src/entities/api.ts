import config from './api/api-data';
import { ApiNames } from '../shared/lib/api-factory/api-names';

export default class Api {
  protected baseApiUrl: string;

  constructor(public name: ApiNames) {
    this.baseApiUrl = `${config.CTP_API_URL}/${config.CTP_PROJECT_KEY}`;
  }
}
