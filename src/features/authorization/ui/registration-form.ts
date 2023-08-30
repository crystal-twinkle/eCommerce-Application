import { CustomerDraft } from '@commercetools/platform-sdk';
import Input from '../../../shared/ui/input/input';
import PasswordInput from '../../../shared/ui/input/input-password';
import countryDropdown from './country-dropdown';
import Form from '../../../shared/ui/form/form';
import './tooltip.scss';
import ViewBuilder from '../../../shared/lib/view-builder';
import InputPostalCode from '../../../shared/ui/input/input-postal-code';
import ElementBuilder from '../../../shared/lib/element-builder';
import checkValidator from '../../../shared/lib/validate/check-validaror';
import appRouter from '../../../shared/lib/router/router';
import { Page } from '../../../shared/lib/router/pages';
import InputEmail from '../../../shared/ui/input/input-email';
import flowFactory from '../../../app/api-flow/flow-factory';
import store from '../../../app/store';
import RequestMessage from './request-message';
import { Mutable } from '../../../shared/lib/mutable';

export default class RegistrationFormView extends ViewBuilder {
  constructor() {
    super('registration-form');
  }

  public configureView(): HTMLElement[] {
    const emailRegClass = new InputEmail();
    const emailReg = emailRegClass.getElement();
    const passwordReg = new PasswordInput();

    const resultsCheckbox: { billDefaultCheck: boolean; shipDefaultCheck: boolean; shipAsBillCheck: boolean } = {
      shipDefaultCheck: false,
      shipAsBillCheck: true,
      billDefaultCheck: false,
    };

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
    });

    billDefaultCheckbox.addEventListener('change', () => {
      resultsCheckbox.billDefaultCheck = billDefaultCheckbox.checked;
    });

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
          try {
            const countryDropdownText: string = countryDropdown?.getSelectedItem()?.content;
            const customerParams: Mutable<CustomerDraft> = {
              email: emailReg.value,
              password: passwordReg.getElement().value,
              firstName: firstName.value,
              lastName: lastName.value,
              dateOfBirth: dob.value,
              addresses: [
                {
                  email: emailReg.value,
                  firstName: firstName.value,
                  lastName: lastName.value,
                  country: countryDropdownText,
                  city: shipCity.value,
                  streetName: shipStreet.value,
                  postalCode: shipPCode.value,
                },
              ],
              shippingAddresses: [0],
              billingAddresses: [],
            };

            if (!resultsCheckbox.shipAsBillCheck) {
              customerParams.billingAddresses.push(1);
              customerParams.addresses.push({
                email: emailReg.value,
                firstName: firstName.value,
                lastName: lastName.value,
                country: countryDropdownText,
                city: billCity.value,
                streetName: billStreet.value,
                postalCode: billPCode.value,
              });
            }

            if (resultsCheckbox.shipDefaultCheck) {
              customerParams.defaultShippingAddress = 0;
            }
            if (resultsCheckbox.shipDefaultCheck && resultsCheckbox.shipAsBillCheck) {
              customerParams.defaultShippingAddress = 0;
              customerParams.billingAddresses.push(0);
              customerParams.defaultBillingAddress = 0;
            }

            if (resultsCheckbox.billDefaultCheck && !resultsCheckbox.shipAsBillCheck) {
              customerParams.defaultBillingAddress = 1;
            }

            const resultCreate = await flowFactory.clientCredentialsFlow
              .customers()
              .post({
                body: customerParams as CustomerDraft,
              })
              .execute();
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
              new RequestMessage().createSuccess();
              store.setUser(loginResult.body.customer);
              appRouter.navigate(Page.OVERVIEW);
            }
          } catch (e) {
            emailRegClass.alreadyExistMessage();
            emailReg.classList.add('input_invalid');
          }
        }
      },
    });

    passwordReg.addShowButton();

    return [registrationForm.getElement()];
  }
}
