import requestCustomer from '../../../shared/const/request-customer';
import requestMessage from '../ui/request-message';
import blackout from '../../blackout/blackout';

interface IResultCreateCustomer {
  statusCode?: number;
  message?: string;
  customer?: object;
}

export default function resultCreateCustomer(resultRequest: IResultCreateCustomer, emailReg: HTMLInputElement) {
  const updateEmailReg = emailReg;
  if (resultRequest.statusCode) {
    if (resultRequest.statusCode === 400) {
      requestCustomer.text = resultRequest.message;
      updateEmailReg.style.borderBottom = '2px solid red';
    } else {
      requestMessage.style.display = 'block';
      requestCustomer.text = '';
      requestMessage.textContent = 'Something went wrong, try again later :)';
      blackout.classList.add('blackout_show');
      updateEmailReg.style.borderBottom = '';
    }
  }

  if (resultRequest.customer) {
    requestMessage.style.display = 'block';
    blackout.classList.add('blackout_show');
    requestMessage.textContent = 'Account created successfully! 🎉';
    requestCustomer.text = '';
    updateEmailReg.style.borderBottom = '';
  }
}
