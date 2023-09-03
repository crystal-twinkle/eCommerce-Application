import { CustomerUpdateAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import { Customer } from '@commercetools/platform-sdk';
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
  private readonly actionsAddress: CustomerUpdateAction[];

  private id: string;
  private version: number;
  private callbackEditAddress: () => void;
  private callbackAddAddress: () => void;
  private addresses: ElementBuilder;
  private data: Customer;
  private checkboxes: { call: (parameter: string, content: string) => HTMLElement };
  private modalInfo: ElementBuilder;
  private currentPassword: PasswordInput | undefined;
  private newPassword: PasswordInput | undefined;
  private readonly modalShipAddressElems: HTMLInputElement[];
  private readonly modalBillAddressElems: HTMLInputElement[];

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
    };
    this.checkboxes = addCheckbox(this.resultsCheckbox);

    this.actionsAddress = [];
    this.editAddressButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Edit addresses',
      callback: () => this.callbackEditAddress(),
    }).getElement();
    this.addAddressButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Add address',
      callback: () => this.callbackAddAddress(),
    }).getElement();
    this.changePasswordButton = new Button({
      type: ButtonType.DEFAULT_COLORED,
      text: 'Change password',
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
    this.modalShipAddressElems = [];
    this.modalBillAddressElems = [];

    this.initData(store.user);
    eventBus.subscribe(EventBusActions.UPDATE_USER, (data) => this.initData(data as Customer));
  }

  private initData = (data: Customer): void => {
    const updateData = data as Customer;
    if (data) {
      this.data = updateData;
      this.id = updateData.id;
      this.version = updateData.version;
      this.show(updateData);
    }
  };

  protected show(data: Customer): void {
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
    this.addInputStyle(userInfoElements);

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

    const addressElems: HTMLInputElement[] = [];
    if (data.addresses.length) {
      const shipAddress = new ElementBuilder({
        tag: 'div',
        styleClass: 'user__address',
        id: 'userShipAddressExist',
      });
      addressElems.push(
        ...addAddress(
          [data.addresses[0].city, data.addresses[0].streetName, data.addresses[0].postalCode],
          shipAddress,
          'Shipping Address',
        ),
      );
      this.addresses.append([shipAddress.getElement()]);

      if (data.addresses.length > 1) {
        const billAddress = new ElementBuilder({
          tag: 'div',
          styleClass: 'user__address',
          id: 'userBillAddressExist',
        });
        addressElems.push(
          ...addAddress(
            [data.addresses[1].city, data.addresses[1].streetName, data.addresses[1].postalCode],
            billAddress,
            'Billing Address',
          ),
        );
        this.addresses.append([billAddress.getElement()]);
      }
    }
    this.addInputStyle(addressElems);

    this.callbackEditAddress = () => {
      if (this.editAddressButton.textContent === 'Edit addresses') {
        this.editAddressButton.textContent = 'Save changes';
        this.changeAddress();
        this.changeInputStyle(addressElems);
      } else if (addressElems.every((elem) => checkValidator(elem))) {
        if (this.resultsCheckbox.shipUse && this.modalShipAddressElems.every((elem) => checkValidator(elem))) {
          this.addNewAddress(this.modalShipAddressElems, 'shipUse');
        }
        if (this.resultsCheckbox.billUse && this.modalBillAddressElems.every((elem) => checkValidator(elem))) {
          this.addNewAddress(this.modalBillAddressElems, 'billUse');
        }
        this.changeAddressInfo();
      }
    };

    this.addresses.append([this.editAddressButton]);
    this.builder.setContent();
    this.builder.append([
      userInfo.getElement(),
      this.addresses.getElement(),
      this.changePasswordButton,
      this.modalInfo.getElement(),
    ]);
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

  protected changeAddress(): void {
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
    this.addresses.prepend([countryDropdown.getElement()]);
    let elementsAdded = false;
    if (!userShipAddressExist || !userBillAddressExist) {
      this.callbackAddAddress = () => {
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
          modalShipAddress.append([this.checkboxes.call('shipUse', 'Add shipping address')]);
        }
        if (!userBillAddressExist && !elementsAdded) {
          this.modalBillAddressElems.push(...addAddress([], modalBillAddress, 'Billing Address'));
          this.changeInputStyle(this.modalBillAddressElems);
          modalBillAddress.append([this.checkboxes.call('billUse', 'Add billing address')]);
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
        if (!elementsAdded) {
          this.modalInfo.append([modalShipAddress.getElement(), modalBillAddress.getElement(), modalOk.getElement()]);
          elementsAdded = true;
        }
      };
      this.editAddressButton.before(this.addAddressButton);
    }
  }

  protected addNewAddress(inputElems: HTMLInputElement[], whatUse: string): void {
    this.modalInfo.getElement().classList.add('hidden');
    const countryDropdownText: string = countryDropdown?.getSelectedItem()?.content;
    const [cityInput, streetInput, postalCodeInput] = inputElems;
    const generateRandomKey = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const randomIndex = () => Math.floor(Math.random() * characters.length);
      return Array.from({ length: 7 }, () => characters[randomIndex()]).join('');
    };
    const city = cityInput.value;
    const streetName = streetInput.value;
    const postalCode = postalCodeInput.value;
    const addressKey = generateRandomKey();
    blackout.classList.remove('blackout_show');
    this.actionsAddress.push({
      action: 'addAddress',
      address: { country: countryDropdownText, city, streetName, postalCode, key: addressKey },
    });
    if (whatUse === 'shipUse') {
      this.actionsAddress.push({ action: 'addShippingAddressId', addressKey });
    }
    if (whatUse === 'billUse') {
      this.actionsAddress.push({ action: 'addBillingAddressId', addressKey });
    }
    console.log(this.actionsAddress);
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
        appRouter.navigate(Page.USER_PROFILE);
        store.setUser(result.body);
        new RequestMessage().showWithText('New data added');
      }
    } catch (e) {
      new RequestMessage().badResult();
    }
  }

  protected async changeAddressInfo(): Promise<void> {
    if (this.resultsCheckbox.shipDefault && !this.resultsCheckbox.shipDelete) {
      this.actionsAddress.push({ action: 'setDefaultShippingAddress', addressId: this.data.addresses[0].id });
    }
    if (!this.resultsCheckbox.shipDefault && this.resultsCheckbox.shipDelete) {
      this.actionsAddress.push({ action: 'removeShippingAddressId', addressId: this.data.addresses[0].id });
      this.actionsAddress.push({ action: 'removeAddress', addressId: this.data.addresses[0].id });
    }
    if (this.resultsCheckbox.billDefault && !this.resultsCheckbox.billDelete) {
      this.actionsAddress.push({ action: 'setDefaultBillingAddress', addressId: this.data.addresses[1].id });
    }
    if (!this.resultsCheckbox.billDefault && this.resultsCheckbox.billDelete) {
      this.actionsAddress.push({ action: 'removeBillingAddressId', addressId: this.data.addresses[1].id });
      this.actionsAddress.push({ action: 'removeAddress', addressId: this.data.addresses[1].id });
    }

    try {
      const result = await flowFactory
        .getWorkingFlow()
        .customers()
        .withId({ ID: this.id })
        .post({
          body: {
            version: this.version,
            actions: this.actionsAddress,
          },
        })
        .execute();
      if (result.statusCode === 200) {
        new RequestMessage().showWithText('New data added');
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
              version: this.version,
              currentPassword: this.currentPassword?.getElement().value,
              newPassword: this.newPassword?.getElement().value,
            },
          })
          .execute();

        if (result.statusCode === 200) {
          new RequestMessage().showWithText('New data added');
          appRouter.navigate(Page.USER_PROFILE);
          store.setUser(result.body);
        }
      } catch (e) {
        new RequestMessage().showWithText('The given current password does not match.');
      }
    }
  }
}
