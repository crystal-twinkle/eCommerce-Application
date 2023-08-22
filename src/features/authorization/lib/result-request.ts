import requestMessage, { requestMessageText } from '../ui/request-message';
import blackout from '../../blackout/blackout';
import customer, { IAddress } from '../../../entities/api/customer';
import InputEmail from '../../../shared/ui/input/input-email';
import appRouter from '../../../shared/lib/router/router';
import { Page } from '../../../shared/lib/router/pages';

interface IRequest {
  statusCode?: number;
  message?: string;
  customer?: { addresses: IAddress[] };
  id: string;
  version: number;
}

export const resultsCheckbox = {
  shipDefaultCheck: false,
  shipAsBillCheck: true,
  billDefaultCheck: false,
};

export async function resultCreateCustomer(request: IRequest, emailReg: InputEmail, password: HTMLInputElement) {
  const updateEmailReg = emailReg.getElement();
  if (request.customer) {
    localStorage.setItem('password', password.value);
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
  const request = await customer().getById(id);
  const basicAddressId: string = request.addresses[0].id;
  const twoAddressId: string = request.addresses[1].id;
  if (!resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [false, false], [basicAddressId, twoAddressId]);
  }
  if (!resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [false, false], [basicAddressId, basicAddressId]);
  }
  if (resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, false], [basicAddressId, twoAddressId]);
  }
  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, true], [basicAddressId, basicAddressId]);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, true], [basicAddressId, twoAddressId]);
  }

  if (resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(request.id, request.version, [false, true], ['', twoAddressId]);
  }
}
