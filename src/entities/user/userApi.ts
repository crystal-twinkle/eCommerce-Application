import { Customer } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/common-types';
import flowFactory from '../../app/api-flow/flow-factory';

export default class UserApi {
  public static async getUser(): Promise<Customer> {
    const response: ClientResponse<Customer> = await flowFactory.getWorkingFlow().me().get().execute();
    return response.body;
  }
}
