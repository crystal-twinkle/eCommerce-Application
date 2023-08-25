import InputEmail from '../../../shared/ui/input/input-email';
import CustomerAPI from '../../../entities/customer/api';
import RequestMessage from '../ui/request-message';
import apiFactory from '../../../shared/lib/api-factory/api-factory';
import { ApiNames } from '../../../shared/lib/api-factory/api-names';

interface IRequest {
  statusCode?: number;
  message?: string;
  customer?: {
    addresses: {
      id: string;
      title: string;
      firstName: string;
      lastName: string;
      streetName: string;
      streetNumber: string;
      postalCode: string;
      city: string;
      region: string;
      state: string;
      country: string;
      email: string;
    }[];
  };
  id: string;
  version: number;
}

export const resultsCheckbox = {
  shipDefaultCheck: false,
  shipAsBillCheck: true,
  billDefaultCheck: false,
};

export async function resultCreateCustomer(request: IRequest, emailReg: InputEmail) {
  const updateEmailReg = emailReg.getElement();
  if (request.customer) {
    new RequestMessage().createSuccess();
  }
  if (request.statusCode) {
    if (request.message === 'There is already an existing customer with the provided email.') {
      emailReg.alreadyExistMessage();
      updateEmailReg.classList.add('input_invalid');
    } else {
      new RequestMessage().badResult();
    }
  }
}

export async function resultGetCustomer(id: string) {
  const customerAPI: CustomerAPI = apiFactory.getApi(ApiNames.CUSTOMER) as CustomerAPI;
  const request = await customerAPI.getById(id);
  const basicAddressId: string = request.addresses[0].id;
  let twoAddressId: string;
  if (request.addresses.length > 1) {
    twoAddressId = request.addresses[1].id;
  }
  if (!resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [false, false], [basicAddressId, twoAddressId]);
  }
  if (!resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [false, false], [basicAddressId, basicAddressId]);
  }
  if (resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [true, false], [basicAddressId, twoAddressId]);
  }
  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [true, true], [basicAddressId, basicAddressId]);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [true, true], [basicAddressId, twoAddressId]);
  }

  if (resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customerAPI.setDefaultAddress(request.id, request.version, [false, true], [basicAddressId, twoAddressId]);
  }
}
