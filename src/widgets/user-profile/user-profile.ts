import { Customer } from '@commercetools/platform-sdk';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import InputPostalCode from '../../shared/ui/input/input-postal-code';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import './user-profile.scss';
import Button from '../../shared/ui/button/button';
import { ButtonType } from '../../shared/ui/button/models';

export default class UserProfile extends CommonBuilderWrapper {
  constructor() {
    super();
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'user',
    });
    eventBus.subscribe(EventBusActions.UPDATE_CUSTOMER, (data) => {
      if (data) {
        this.show(data as Customer);
      }
    });
  }

  protected show(data: Customer) {
    const userInfoElements = [
      new Input({
        placeholder: `First name: ${data.firstName}`,
        name: 'firstName',
      }).getElement(),
      new Input({
        placeholder: `Last name: ${data.lastName}`,
        name: 'lastName',
      }).getElement(),
      new Input({
        type: 'date',
        name: 'dob',
      })
        .setTagSettings({ value: data.dateOfBirth })
        .getElement(),
    ];

    userInfoElements.forEach((element) => {
      element.setAttribute('disabled', '');
      element.classList.add('user__input');
    });

    const userInfoTitle = new ElementBuilder({
      tag: 'h4',
      content: 'You Info',
    }).getElement();
    const editUserInfo = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit info',
    }).getElement();
    const userInfo = new ElementBuilder({
      tag: 'div',
      styleClass: 'user__info',
    }).append([userInfoTitle, ...userInfoElements, editUserInfo]);

    const shipTitle = new ElementBuilder({ tag: 'h4', content: 'Shipping Address' }).getElement();

    const shipAddressElements = [
      new Input({
        styleClass: 'user__input',
        placeholder: `City: ${data.addresses[0].city}`,
        name: 'city',
      }).getElement(),
      new Input({
        styleClass: 'user__input',
        placeholder: data.addresses[0].streetName,
        name: 'street',
      }).getElement(),
      new InputPostalCode({ placeholder: data.addresses[0].postalCode }).getElement(),
    ];

    shipAddressElements.forEach((element) => {
      element.setAttribute('disabled', '');
      element.classList.add('user__input');
    });

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
          styleClass: 'user__input',
          placeholder: data.addresses[1].city,
          name: 'city',
        }).getElement(),
        new Input({
          styleClass: 'user__input',
          placeholder: data.addresses[1].streetName,
          name: 'street',
        }).getElement(),
        new InputPostalCode({ placeholder: data.addresses[1].postalCode }).getElement(),
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

      addresses.append([billAddress.getElement()]);
    }
    const editAddress = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit address',
    }).getElement();
    addresses.append([editAddress]);
    this.builder.append([userInfo.getElement(), addresses.getElement()]);
  }
}
