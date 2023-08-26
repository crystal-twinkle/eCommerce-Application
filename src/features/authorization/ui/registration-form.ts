import Input from '../../../shared/ui/input/input';
import PasswordInput from '../../../shared/ui/input/input-password';
import countryDropdown from './country-dropdown';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import ViewBuilder from '../../../shared/lib/view-builder';
import InputPostalCode from '../../../shared/ui/input/input-postal-code';
import CustomerAPI, { addressesCreate } from '../../../entities/customer/api';
import ElementBuilder from '../../../shared/lib/element-builder';
import { resultCreateCustomer, resultGetCustomer, resultsCheckbox } from '../lib/result-request';
import checkValidator from '../../../shared/lib/validate/check-validaror';
import appRouter from '../../../shared/lib/router/router';
import { Page } from '../../../shared/lib/router/pages';
import InputEmail from '../../../shared/ui/input/input-email';
import apiFactory from '../../../shared/lib/api-factory/api-factory';
import ApiNames from '../../../shared/lib/api-factory/api-names';
import flowFactory from '../../../app/api-flow/flow-factory';
import store from '../../../app/store';

export default class RegistrationFormView extends ViewBuilder {
  constructor() {
    super('registration-form');
  }

  public configureView(): HTMLElement[] {
    const emailRegClass = new InputEmail();
    const emailReg = emailRegClass.getElement();
    const passwordReg = new PasswordInput();

    const firstName = new Input({
      placeholder: 'First Name',
      name: 'firstName',
    }).getElement();

    const lastName = new Input({
      placeholder: 'Last Name',
      name: 'lastName',
    }).getElement();

    const shipAddress = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__address',
    }).getElement();

    const shipTitle = new ElementBuilder({ tag: 'h4', content: 'Shipping Address' }).getElement();

    const shipCity = new Input({
      placeholder: 'City',
      name: 'city',
    }).getElement();

    const shipStreet = new Input({
      placeholder: 'Street',
      name: 'street',
    }).getElement();

    const shipPCode = new InputPostalCode().getElement();

    const shipDefault = new ElementBuilder({
      tag: 'div',
    }).getElement();

    const shipDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

    const shipDefaultText = new ElementBuilder({
      tag: 'span',
      content: 'Set as default address',
    }).getElement();
    shipDefault.append(shipDefaultCheckbox, shipDefaultText);

    const shipAsBill = new ElementBuilder({
      tag: 'div',
    }).getElement();
    const shipAsBillCheckbox = new Input({ type: 'checkbox' }).getElement();
    shipAsBillCheckbox.checked = true;

    const shipAsBillText = new ElementBuilder({
      tag: 'span',
      content: 'Also use as billing address',
    }).getElement();
    shipAsBill.append(shipAsBillCheckbox, shipAsBillText);

    shipAddress.append(shipTitle, shipCity, shipStreet, shipPCode, shipDefault, shipAsBill);

    const billAddress = new ElementBuilder({
      tag: 'div',
      styleClass: 'form__address',
    }).getElement();

    const billTitle = new ElementBuilder({ tag: 'h4', content: 'Billing Address' }).getElement();
    const billCity = new Input({
      placeholder: 'City',
      name: 'city',
    }).getElement();
    billAddress.style.display = 'none';
    const billStreet = new Input({
      placeholder: 'Street',
      name: 'street',
    }).getElement();
    const billPCode = new InputPostalCode().getElement();

    const billDefault = new ElementBuilder({
      tag: 'div',
    }).getElement();
    const billDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

    const billDefaultText = new ElementBuilder({
      tag: 'span',
      content: 'Set as default address',
    }).getElement();
    billDefault.append(billDefaultCheckbox, billDefaultText);

    billAddress.append(billTitle, billCity, billStreet, billPCode, billDefault);

    const dob = new Input({
      type: 'date',
      name: 'dob',
    }).getElement();

    shipDefaultCheckbox.addEventListener('change', () => {
      resultsCheckbox.shipDefaultCheck = shipDefaultCheckbox.checked;
    });

    shipAsBillCheckbox.addEventListener('change', () => {
      if (shipAsBillCheckbox.checked) {
        billAddress.style.display = 'none';
      } else {
        billAddress.style.display = 'flex';
      }
      resultsCheckbox.shipAsBillCheck = shipAsBillCheckbox.checked;
      resultsCheckbox.billDefaultCheck = false;
    });

    billDefaultCheckbox.addEventListener('change', () => {
      resultsCheckbox.billDefaultCheck = billDefaultCheckbox.checked;
    });

    const customerAPI: CustomerAPI = apiFactory.getApi(ApiNames.CUSTOMER) as CustomerAPI;
    const registrationForm = new Form({
      title: 'Registration',
      id: 'form-registration',
      fields: [
        emailReg,
        passwordReg.getElement(),
        firstName,
        lastName,
        countryDropdown.getElement(),
        dob,
        shipAddress,
        billAddress,
      ],

      buttons: [{ text: 'Submit' }, { text: 'Login', callback: () => appRouter.navigate(Page.LOGIN) }],
      callback: async (event) => {
        event.preventDefault();
        let checkValid = [
          emailReg,
          passwordReg.getElement(),
          firstName,
          lastName,
          shipCity,
          shipStreet,
          shipPCode,
          dob,
        ].every((elem) => checkValidator(elem));
        if (!resultsCheckbox.shipAsBillCheck) {
          checkValid = [billCity, billStreet, billPCode].every((elem) => checkValidator(elem));
        }
        if (checkValid) {
          addressesCreate.length = 0;
          customerAPI.addAddress([
            emailReg.value,
            firstName.value,
            lastName.value,
            shipPCode.value,
            shipCity.value,
            shipStreet.value,
          ]);
          if (!resultsCheckbox.shipAsBillCheck) {
            await customerAPI.addAddress([
              emailReg.value,
              firstName.value,
              lastName.value,
              billPCode.value,
              billCity.value,
              billStreet.value,
            ]);
          }
          const resultCreate = await flowFactory.clientCredentialsFlow
            .me()
            .signup()
            .post({
              body: {
                email: emailReg.value,
                password: passwordReg.getElement().value,
                firstName: firstName.value,
                lastName: lastName.value,
                dateOfBirth: dob.value,
              },
            })
            .execute();
          await resultCreateCustomer(resultCreate.body.customer, emailRegClass);
          if (resultCreate.body.customer) {
            flowFactory.createPasswordFlow(emailReg.value, passwordReg.getElement().value);
            const loginResult = await flowFactory.passwordFlow
              .me()
              .login()
              .post({
                body: {
                  email: emailReg.value,
                  password: passwordReg.getElement().value,
                },
              })
              .execute();
            await resultGetCustomer(resultCreate.body.customer.id);
            store.setCustomer(loginResult.body.customer);
            appRouter.navigate(Page.OVERVIEW);
          }
        }
      },
    });

    passwordReg.addShowButton();

    return [registrationForm.getElement()];
  }
}
