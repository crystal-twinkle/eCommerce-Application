import { Customer } from '@commercetools/platform-sdk';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import InputPostalCode from '../../shared/ui/input/input-postal-code';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './user-profile.scss';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';
import flowFactory from '../../app/api-flow/flow-factory';
import RequestMessage from '../../features/request-message/request-message';
import checkValidator from '../../shared/lib/validate/check-validaror';

export default class UserProfile extends CommonBuilderWrapper {
  private id: string;
  private version: number;
  constructor() {
    super();
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'user',
    });
    eventBus.subscribe(EventBusActions.UPDATE_CUSTOMER, (data) => {
      const updateData = data as Customer;
      if (data) {
        console.log(data);
        this.id = updateData.id;
        this.version = updateData.version;
        this.show(updateData);
      }
    });
  }

  protected show(data: Customer) {
    const userInfoElements = [
      new Input({
        value: data.firstName,
        name: 'firstName',
      }).getElement(),
      new Input({
        value: data.lastName,
        name: 'lastName',
      }).getElement(),
      new Input({
        value: data.email,
        name: 'email',
      }).getElement(),
      new Input({
        type: 'date',
        name: 'dob',
      })
        .setTagSettings({ value: data.dateOfBirth })
        .getElement(),
    ];

    const userInfoTitle = new ElementBuilder({
      tag: 'h4',
      content: 'You Info',
    }).getElement();

    const editUserInfo = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit info',
      callback: () => {
        if (editUserInfo.textContent === 'Edit info') {
          editUserInfo.textContent = 'Save info';
          this.changeInputStyle(userInfoElements);
        } else if (userInfoElements.every((elem) => checkValidator(elem))) {
          editUserInfo.textContent = 'Edit info';
          this.addInputStyle(userInfoElements);
          this.editInfo(userInfoElements);
        }
      },
    }).getElement();

    const userInfo = new ElementBuilder({
      tag: 'div',
      styleClass: 'user__info',
    }).append([userInfoTitle, ...userInfoElements, editUserInfo]);

    const shipTitle = new ElementBuilder({ tag: 'h4', content: 'Shipping Address' }).getElement();

    const shipAddressElements = [
      new Input({
        styleClass: 'user__input',
        value: `City: ${data.addresses[0].city}`,
        name: 'city',
      }).getElement(),
      new Input({
        styleClass: 'user__input',
        value: data.addresses[0].streetName,
        name: 'street',
      }).getElement(),
      new InputPostalCode({ value: data.addresses[0].postalCode }).getElement(),
    ];

    this.addInputStyle([...userInfoElements, ...shipAddressElements]);

    const shipDefault = new ElementBuilder({
      tag: 'div',
    }).getElement();

    const shipDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

    const shipDefaultText = new ElementBuilder({
      tag: 'span',
      content: 'Set as default address',
    }).getElement();
    shipDefault.append(shipDefaultCheckbox, shipDefaultText);

    const shipAddress = new ElementBuilder({
      tag: 'div',
      styleClass: 'user__address',
    }).append([shipTitle, ...shipAddressElements]);

    const addresses = new ElementBuilder({
      tag: 'div',
      styleClass: 'user__addresses',
    }).append([shipAddress.getElement()]);

    if (data.addresses.length > 1) {
      const billTitle = new ElementBuilder({ tag: 'h4', content: 'Billing Address' }).getElement();
      const billAddressElements = [
        new Input({
          value: data.addresses[1].city,
          name: 'city',
        }).getElement(),
        new Input({
          value: data.addresses[1].streetName,
          name: 'street',
        }).getElement(),
        new InputPostalCode({ value: data.addresses[1].postalCode }).getElement(),
      ];

      billAddressElements.forEach((element) => {
        element.setAttribute('disabled', '');
        element.classList.add('user__input');
      });
      const billAddress = new ElementBuilder({
        tag: 'div',
        styleClass: 'user__address',
      }).append([billTitle, ...billAddressElements]);

      const billDefault = new ElementBuilder({
        tag: 'div',
      }).getElement();
      const billDefaultCheckbox = new Input({ type: 'checkbox' }).getElement();

      const billDefaultText = new ElementBuilder({
        tag: 'span',
        content: 'Set as default address',
      }).getElement();
      billDefault.append(billDefaultCheckbox, billDefaultText);
      this.addInputStyle(billAddressElements);
      addresses.append([billAddress.getElement()]);
    }

    const editAddress = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit address',
    }).getElement();
    addresses.append([editAddress]);

    this.builder.append([userInfo.getElement(), addresses.getElement()]);
  }

  private addInputStyle(elements: HTMLInputElement[]) {
    elements.forEach((element) => {
      element.setAttribute('disabled', '');
      element.classList.add('user__input');
      element.classList.remove('_edit');
    });
  }

  private changeInputStyle(elements: HTMLInputElement[]) {
    elements.forEach((element) => {
      element.classList.add('_edit');
      element.removeAttribute('disabled');
    });
  }

  protected async editInfo(inputs: HTMLInputElement[]) {
    const [firstname, lastname, email, dob] = inputs;
    try {
      const result = await flowFactory.clientCredentialsFlow
        .customers()
        .withId({ ID: this.id })
        .post({
          body: {
            version: this.version,
            actions: [
              {
                action: 'setDateOfBirth',
                dateOfBirth: dob.value,
              },
              { action: 'setFirstName', firstName: firstname.value },
              { action: 'setLastName', lastName: lastname.value },
              { action: 'changeEmail', email: email.value },
            ],
          },
        })
        .execute();
      if (result.statusCode === 200) {
        console.log(result);
        new RequestMessage().showWithText('New data added');
      }
    } catch (e) {
      new RequestMessage().badResult();
    }
  }
}
