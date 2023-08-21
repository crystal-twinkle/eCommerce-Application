import requestMessage, { requestMessageText } from '../ui/request-message';
import blackout from '../../blackout/blackout';
import customer from '../../../entities/api/customer';
import InputEmail from '../../../shared/ui/input/input-email';

interface IAddress {
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
}

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

export async function resultCreateCustomer(request: IRequest, emailReg: InputEmail) {
  const updateEmailReg = emailReg.getElement();
  if (request.customer) {
    requestMessage.style.display = 'block';
    blackout.classList.add('blackout_show');
    requestMessageText.textContent = 'Account created successfully! 🎉';
    updateEmailReg.style.borderBottom = '';
  }
  if (request.statusCode) {
    if (request.message === 'There is already an existing customer with the provided email.') {
      emailReg.alreadyExistMessage();
      updateEmailReg.style.borderBottom = '2px solid red';
    } else {
      requestMessage.style.display = 'block';
      requestMessageText.textContent = 'Something went wrong, try again later :)';
      blackout.classList.add('blackout_show');
      updateEmailReg.style.borderBottom = '';
    }
  }
}

export async function resultGetCustomer(id: string) {
  const request = await customer().getById(id);
  const basicId: string = request.addresses[0].id;
  if (resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, false], [basicId, '']);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, true], [basicId, basicId]);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, true], [basicId, request.addresses[1].id]);
  }

  if (resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(request.id, request.version, [false, true], ['', request.addresses[1].id]);
  }
}
