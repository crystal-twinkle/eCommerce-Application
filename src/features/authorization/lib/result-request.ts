import requestCustomer from '../../../shared/const/request-customer';
import requestMessage from '../ui/request-message';
import blackout from '../../blackout/blackout';
import customer from '../../../entities/api/customer';

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
  shipAsBillCheck: false,
  billDefaultCheck: false,
};

export async function resultCreateCustomer(request: IRequest, emailReg: HTMLInputElement) {
  const updateEmailReg = emailReg;
  if (request.customer) {
    requestMessage.style.display = 'block';
    blackout.classList.add('blackout_show');
    requestMessage.textContent = 'Account created successfully! 🎉';
    requestCustomer.text = '';
    updateEmailReg.style.borderBottom = '';
  }
  if (request.statusCode) {
    if (request.statusCode === 400) {
      requestCustomer.text = request.message;
      updateEmailReg.style.borderBottom = '2px solid red';
    } else {
      requestMessage.style.display = 'block';
      requestCustomer.text = '';
      requestMessage.textContent = 'Something went wrong, try again later :)';
      blackout.classList.add('blackout_show');
      updateEmailReg.style.borderBottom = '';
    }
  }
}

export async function resultGetCustomer(request: IRequest) {
  const basicId = request.customer.addresses[0].id;
  if (resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, false], [basicId, '']);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck && !resultsCheckbox.billDefaultCheck) {
    await customer().setDefaultAddress(request.id, request.version, [true, true], [basicId, basicId]);
  }

  if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(
      request.id,
      request.version,
      [true, true],
      [basicId, request.customer.addresses[1].id],
    );
  }

  if (resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
    await customer().setDefaultAddress(
      request.id,
      request.version,
      [false, true],
      ['', request.customer.addresses[1].id],
    );
  }
}
