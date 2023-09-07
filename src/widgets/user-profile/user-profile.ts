import { CustomerUpdateAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import { Address, Customer } from '@commercetools/platform-sdk';
import '../../shared/assets/style/hidden.scss';
import './user-profile.scss';
import ElementBuilder from '../../shared/lib/element-builder';
import Input from '../../shared/ui/input/input';
import eventBus, { EventBusActions } from '../../shared/lib/event-bus';
import addAddress from '../../shared/lib/add-address';
import addCheckbox from '../../shared/lib/add-checkbox';
import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import Button from '../../shared/ui/button/button';
import { ButtonSize, ButtonType } from '../../shared/ui/button/models';
import flowFactory from '../../app/api-flow/flow-factory';
import RequestMessage from '../../features/request-message/request-message';
import checkValidator from '../../shared/lib/validate/check-validaror';
import { IResultsCheckbox } from '../../shared/const/results-checkbox';
import countryDropdown from '../../features/authorization/country-dropdown';
import store from '../../app/store';
import blackout from '../../features/blackout/blackout';
import appRouter from '../../shared/lib/router/router';
import { Page } from '../../shared/lib/router/pages';
import PasswordInput from '../../shared/ui/input/input-password';
import Form from '../../shared/ui/form/form';
import Loader from '../../shared/ui/loader/loader';

export default class UserProfile extends CommonBuilderWrapper {
  private readonly resultsCheckbox: IResultsCheckbox;
  private readonly editAddressButton: HTMLElement;
  private readonly addAddressButton: HTMLElement;
  private readonly changePasswordButton: HTMLElement;
  private actionsAddress: CustomerUpdateAction[];

  private id: string;
  private callbackEditAddress: () => void;
  private modalAddresses: () => void;
  private saveNewAddress: () => void;
  private addresses: ElementBuilder;
  private data: Customer;
  private checkboxes: { call: (parameter: string, content: string) => HTMLElement };
  private modalInfo: ElementBuilder;
  private currentPassword: PasswordInput | undefined;
  private newPassword: PasswordInput | undefined;
  private infoShipAddress: Address;
  private infoBillAddress: Address;
  private modalShipAddressElems: HTMLInputElement[];
  private modalBillAddressElems: HTMLInputElement[];

  constructor() {
    super();
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'user',
    });
    this.builder.append([new Loader('user__loader').getElement()]);

    this.resultsCheckbox = {
      shipDefault: false,
      billDefault: false,
      shipDelete: false,
      billDelete: false,
      shipUse: false,
      billUse: false,
      shipDefaultNew: false,
      billDefaultNew: false,
    };

    this.editAddressButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit addresses',
      styleClass: 'user__btn',
      callback: () => this.callbackEditAddress(),
    }).getElement();
    this.addAddressButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Add address',
      styleClass: 'user__btn',
      callback: () => this.modalAddresses(),
    }).getElement();
    this.changePasswordButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Change password',
      styleClass: 'user__btn',
      callback: () => this.callbackChangePassword(),
    }).getElement();
    this.addresses = new ElementBuilder({
      tag: 'div',
      styleClass: 'user__addresses',
    });
    this.modalInfo = new ElementBuilder({
      tag: 'div',
      styleClass: 'hidden modal',
    });

    this.initData(store.user);
    eventBus.subscribe(EventBusActions.UPDATE_USER, (data) => this.initData(data as Customer));
  }

  private initData = (data: Customer): void => {
    this.builder.setContent();
    this.addresses.setContent();
    const updateData = data as Customer;
    if (data) {
      this.checkboxes = addCheckbox(this.resultsCheckbox);
      this.actionsAddress = [];
      this.data = updateData;
      this.id = updateData.id;
      this.modalBillAddressElems = [];
      this.modalShipAddressElems = [];
      this.addressFill();
      this.builder.append([
        this.userInfo(),
        this.addresses.getElement(),
        this.changePasswordButton,
        this.modalInfo.getElement(),
      ]);
    }
  };

  protected userInfo(): HTMLElement {
    const userInfoElements = [
      new Input({
        value: this.data.firstName,
        name: 'firstName',
      }).getElement(),
      new Input({
        value: this.data.lastName,
        name: 'lastName',
      }).getElement(),
      new Input({
        value: this.data.email,
        name: 'email',
      }).getElement(),
      new Input({
        type: 'date',
        name: 'dob',
      })
        .setTagSettings({ value: this.data.dateOfBirth })
        .getElement(),
    ];

    this.addInputStyle(userInfoElements);
    const userInfoTitle = new ElementBuilder({
      tag: 'h4',
      content: 'You Info',
    }).getElement();

    const editUserInfo = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit info',
      styleClass: 'user__btn',
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

    return userInfo.getElement();
  }

  protected addressFill(): void {
    const addressElems: HTMLInputElement[] = [];
    this.data.addresses.forEach((e) => {
      if (this.data.shippingAddressIds[0] === e.id) {
        this.infoShipAddress = e;
      }
      if (this.data.billingAddressIds[0] === e.id) {
        this.infoBillAddress = e;
      }
    });

    if (this.data.shippingAddressIds[0]) {
      const shipAddress = new ElementBuilder({
        tag: 'div',
        styleClass: 'user__address',
        id: 'userShipAddressExist',
      });
      addressElems.push(
        ...addAddress(
          [this.infoShipAddress.city, this.infoShipAddress.streetName, this.infoShipAddress.postalCode],
          shipAddress,
          'Shipping Address',
        ),
      );
      this.addresses.append([shipAddress.getElement()]);
    }
    if (this.data.billingAddressIds[0]) {
      const billAddress = new ElementBuilder({
        tag: 'div',
        styleClass: 'user__address',
        id: 'userBillAddressExist',
      });
      addressElems.push(
        ...addAddress(
          [this.infoBillAddress.city, this.infoBillAddress.streetName, this.infoBillAddress.postalCode],
          billAddress,
          'Billing Address',
        ),
      );
      this.addresses.append([billAddress.getElement()]);
    }
    this.addInputStyle(addressElems);

    this.callbackEditAddress = () => {
      if (this.editAddressButton.textContent === 'Edit addresses') {
        this.editAddressButton.textContent = 'Save changes';
        this.modalAddress();
        this.changeInputStyle(addressElems);
      } else if (addressElems.every((elem) => checkValidator(elem))) {
        this.saveNewAddress();
        this.changeAddressInfo();
      }
    };

    this.addresses.append([this.editAddressButton]);
  }

  private addInputStyle(elements: HTMLInputElement[]): void {
    elements.forEach((element) => {
      element.setAttribute('disabled', '');
      element.classList.remove('_edit');
    });
  }

  private changeInputStyle(elements: HTMLInputElement[]): void {
    elements.forEach((element) => {
      element.classList.add('_edit');
      element.removeAttribute('disabled');
    });
  }

  protected modalAddress(): void {
    const userShipAddressExist = document.getElementById('userShipAddressExist');
    if (userShipAddressExist) {
      if (!this.data.defaultShippingAddressId) {
        userShipAddressExist.append(this.checkboxes.call('shipDefault', 'Set as default address'));
      }
      userShipAddressExist.append(this.checkboxes.call('shipDelete', 'Delete shipping address'));
    }
    const userBillAddressExist = document.getElementById('userBillAddressExist');
    if (userBillAddressExist) {
      if (!this.data.defaultBillingAddressId) {
        userBillAddressExist.append(this.checkboxes.call('billDefault', 'Set as default address'));
      }
      userBillAddressExist.append(this.checkboxes.call('billDelete', 'Delete billing address'));
    }
    countryDropdown.setSelectedItem(this.data.addresses[0]?.country || 'US');
    this.addresses.prepend([countryDropdown.getElement()]);
    let elementsAdded = false;
    if (!userShipAddressExist || !userBillAddressExist) {
      this.modalAddresses = () => {
        const modalShipAddress = new ElementBuilder({
          tag: 'div',
          styleClass: 'user__address',
        });
        const modalBillAddress = new ElementBuilder({
          tag: 'div',
          styleClass: 'user__address',
        });
        if (!userShipAddressExist && !elementsAdded) {
          this.modalShipAddressElems.push(...addAddress([], modalShipAddress, 'Shipping Address'));
          this.changeInputStyle(this.modalShipAddressElems);
          modalShipAddress.append([
            this.checkboxes.call('shipUse', 'Add shipping address'),
            this.checkboxes.call('shipDefaultNew', 'Set as default address'),
          ]);
        }
        if (!userBillAddressExist && !elementsAdded) {
          this.modalBillAddressElems.push(...addAddress([], modalBillAddress, 'Billing Address'));
          this.changeInputStyle(this.modalBillAddressElems);
          modalBillAddress.append([
            this.checkboxes.call('billUse', 'Add billing address'),
            this.checkboxes.call('billDefaultNew', 'Set as default address'),
          ]);
        }
        this.modalInfo.getElement().classList.remove('hidden');
        blackout.classList.add('blackout_show');
        const modalOk = new Button({
          type: ButtonType.CIRCLE_COLORED,
          text: 'Ok',
          size: ButtonSize.SMALL,
          callback: () => {
            if (
              (this.resultsCheckbox.billUse && this.modalBillAddressElems.every((elem) => checkValidator(elem))) ||
              (this.resultsCheckbox.shipUse && this.modalShipAddressElems.every((elem) => checkValidator(elem)))
            ) {
              blackout.classList.remove('blackout_show');
              this.modalInfo.getElement().classList.add('hidden');
            }
            if (!this.resultsCheckbox.billUse || !this.resultsCheckbox.shipUse) {
              blackout.classList.remove('blackout_show');
              this.modalInfo.getElement().classList.add('hidden');
            }
          },
        });
        this.saveNewAddress = () => {
          if (this.resultsCheckbox.shipUse && this.modalShipAddressElems.every((elem) => checkValidator(elem))) {
            this.addNewAddress(this.modalShipAddressElems, 'shipUse');
          }
          if (this.resultsCheckbox.billUse && this.modalBillAddressElems.every((elem) => checkValidator(elem))) {
            this.addNewAddress(this.modalBillAddressElems, 'billUse');
          }
        };
        if (!elementsAdded) {
          this.modalInfo.append([modalShipAddress.getElement(), modalBillAddress.getElement(), modalOk.getElement()]);
          elementsAdded = true;
        }
      };
      this.editAddressButton.before(this.addAddressButton);
    }
  }

  protected addNewAddress(inputElems: HTMLInputElement[], whatUse: string): void {
    const countryDropdownText: string = countryDropdown?.getSelectedText();
    const [cityInput, streetInput, postalCodeInput] = inputElems;
    const generateRandomKey = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const randomIndex = () => Math.floor(Math.random() * characters.length);
      return Array.from({ length: 7 }, () => characters[randomIndex()]).join('');
    };
    const city = cityInput?.value;
    const streetName = streetInput?.value;
    const postalCode = postalCodeInput?.value;
    const addressKey = generateRandomKey();
    this.actionsAddress.push({
      action: 'addAddress',
      address: { country: countryDropdownText, city, streetName, postalCode, key: addressKey },
    });
    if (whatUse === 'shipUse') {
      this.actionsAddress.push({ action: 'addShippingAddressId', addressKey });
      if (this.resultsCheckbox.shipDefaultNew) {
        this.actionsAddress.push({ action: 'setDefaultShippingAddress', addressKey });
      }
    }
    if (whatUse === 'billUse') {
      this.actionsAddress.push({ action: 'addBillingAddressId', addressKey });
      if (this.resultsCheckbox.billDefaultNew) {
        this.actionsAddress.push({ action: 'setDefaultBillingAddress', addressKey });
      }
    }
  }

  protected async editInfo(inputs: HTMLInputElement[]): Promise<void> {
    const [firstname, lastname, email, dob] = inputs;
    try {
      const result = await flowFactory
        .getWorkingFlow()
        .customers()
        .withId({ ID: this.id })
        .post({
          body: {
            version: this.data.version,
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
        appRouter.navigate(Page.USER_PROFILE);
        store.setUser(result.body);
        new RequestMessage().updateUser();
      }
    } catch (e) {
      new RequestMessage().badResult();
    }
  }

  protected async changeAddressInfo(): Promise<void> {
    if (this.resultsCheckbox.shipDefault && !this.resultsCheckbox.shipDelete) {
      this.actionsAddress.push({ action: 'setDefaultShippingAddress', addressId: this.infoShipAddress.id });
    }
    if (!this.resultsCheckbox.shipDefault && this.resultsCheckbox.shipDelete) {
      this.actionsAddress.push({ action: 'removeShippingAddressId', addressId: this.infoShipAddress.id });
      this.actionsAddress.push({ action: 'removeAddress', addressId: this.infoShipAddress.id });
    }
    if (this.resultsCheckbox.billDefault && !this.resultsCheckbox.billDelete) {
      this.actionsAddress.push({ action: 'setDefaultBillingAddress', addressId: this.infoBillAddress.id });
    }
    if (!this.resultsCheckbox.billDefault && this.resultsCheckbox.billDelete) {
      this.actionsAddress.push({ action: 'removeBillingAddressId', addressId: this.infoBillAddress.id });
      this.actionsAddress.push({ action: 'removeAddress', addressId: this.infoBillAddress.id });
    }
    console.log(this.actionsAddress);
    try {
      const result = await flowFactory
        .getWorkingFlow()
        .customers()
        .withId({ ID: this.id })
        .post({
          body: {
            version: this.data.version,
            actions: this.actionsAddress,
          },
        })
        .execute();
      if (result.statusCode === 200) {
        new RequestMessage().updateUser();
        appRouter.navigate(Page.USER_PROFILE);
        store.setUser(result.body);
      }
    } catch (e) {
      new RequestMessage().badResult();
    }
  }

  private async callbackChangePassword(): Promise<void> {
    if (this.changePasswordButton.textContent === 'Change password') {
      this.currentPassword = new PasswordInput('Current password');
      this.newPassword = new PasswordInput('New password');
      const userInfoPassword = new Form({
        title: 'Change password :)',
        fields: [this.currentPassword.getElement(), this.newPassword.getElement()],
      });
      this.changePasswordButton.before(userInfoPassword.getElement());
      this.changePasswordButton.textContent = 'Save new password';
    } else if ([this.currentPassword?.getElement(), this.newPassword?.getElement()].every((e) => checkValidator(e))) {
      try {
        const result = await flowFactory
          .getWorkingFlow()
          .customers()
          .password()
          .post({
            body: {
              id: this.id,
              version: this.data.version,
              currentPassword: this.currentPassword?.getElement().value,
              newPassword: this.newPassword?.getElement().value,
            },
          })
          .execute();

        if (result.statusCode === 200) {
          localStorage.removeItem('token_store');
          new RequestMessage().updateUser();
          appRouter.navigate(Page.LOGIN);
          store.setUser(null);
        }
      } catch (e) {
        new RequestMessage().showWithText('The given current password does not match.');
      }
    }
  }
}
