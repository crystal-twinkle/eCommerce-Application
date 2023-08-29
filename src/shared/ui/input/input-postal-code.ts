import Input from './input';
import countryDropdown from '../../../features/authorization/ui/country-dropdown';

export default class InputPostalCode extends Input {
  constructor(config?: { placeholder?: string; value?: string }) {
    super({
      type: 'text',
      placeholder: config?.placeholder || 'PostalCode',
      value: config?.value,
      name: 'postalCode',
    });
    this.showErrorMessage = this.showErrorMessage.bind(this);

    this.builder.setEventHandler({ type: 'input', callback: this.showErrorMessage });
    this.builder.setEventHandler({ type: 'input', callback: this.checkInput.bind(this) });
  }

  protected showErrorMessage() {
    const countryDropdownText: string = countryDropdown?.getSelectedItem()?.content;
    if (countryDropdownText !== 'US' && countryDropdownText !== 'Canada') {
      this.message.setContent('Select country');
    }
    if (countryDropdownText === 'US') {
      this.message.setContent('The format for the USA should be like "12345"');
    }
    if (countryDropdownText === 'Canada') {
      this.message.setContent('The format for the Canada should be like "A1B 2C3"');
    }

    this.builder.getElement().after(this.message.getElement());
  }
}
