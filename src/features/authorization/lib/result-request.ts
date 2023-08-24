import requestMessage, { requestMessageText } from '../ui/request-message';
import blackout from '../../blackout/blackout';
import InputEmail from '../../../shared/ui/input/input-email';
import appRouter from '../../../shared/lib/router/router';
import { Page } from '../../../shared/lib/router/pages';
import CustomerAPI from '../../../entities/customer/api';
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
    requestMessage.style.display = 'block';
    blackout.classList.add('blackout_show');
    requestMessageText.textContent = 'Account created successfully! 🎉';
    updateEmailReg.style.borderBottom = '';
    appRouter.navigate(Page.OVERVIEW);
  }
  if (request.statusCode) {
    if (request.message === 'There is already an existing customer with the provided email.') {
      emailReg.alreadyExistMessage();
      updateEmailReg.classList.add('input_invalid');
    } else {
      requestMessage.style.display = 'block';
      requestMessageText.textContent = 'Something went wrong, try again later :)';
      blackout.classList.add('blackout_show');
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
