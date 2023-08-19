import countryDropdown from '../ui/country-dropdown';
import requestCustomer from '../../../shared/const/request-customer';

export function tooltipsText(input: Element) {
  const inputName = input.getAttribute('name');
  const tooltip = document.querySelector(`.tooltip`);
  const countryDropdownText = countryDropdown.options[countryDropdown.selectedIndex].textContent;
  if (inputName === 'email' && requestCustomer.text) {
    tooltip.textContent = requestCustomer.text;
  }
  if (inputName === 'email' && !requestCustomer.text) {
    tooltip.textContent = 'Enter a properly formatted email address (like "example@email.com")';
  }
  if (inputName === 'password') {
    tooltip.innerHTML =
      'Must be at least 8 characters long, contain at least 1 uppercase letter,<br>1 lowercase letter, and 1 number';
  }
  if (inputName === 'firstName') {
    tooltip.textContent = 'Must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'lastName') {
    tooltip.textContent = 'Must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'city') {
    tooltip.textContent = 'Must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'street') {
    tooltip.textContent = 'This field must contain at least one character';
  }
  if (inputName === 'dob') {
    tooltip.textContent = 'You must be over 13 years old';
  }
  if (inputName === 'postalCode' && countryDropdownText === 'Select country:') {
    tooltip.textContent = 'You should choose country';
  }
  if (inputName === 'postalCode' && countryDropdownText === 'USA') {
    tooltip.textContent = "The format for the USA should be like '12345'";
  }
  if (inputName === 'postalCode' && countryDropdownText === 'Canada') {
    tooltip.textContent = "The format for the Canada should be like 'A1B 2C3'";
  }
}

export const tooltipRegistry: Record<string, () => void> = {};

export default function validationTooltip(input: HTMLInputElement) {
  const inputName = input.getAttribute('name');
  const pos = input.getBoundingClientRect();
  const tooltips: HTMLElement = document.querySelector('.tooltip');

  const showTooltip = () => {
    tooltipsText(input);
    tooltips.classList.add('visible');
    tooltips.style.top = `${pos.top + 35}px`;
    tooltips.style.left = `${pos.left + 7}px`;
  };

  const hideTooltip = () => {
    tooltips.classList.remove('visible');
  };

  const add = () => {
    tooltipRegistry[inputName] = showTooltip;
    input.addEventListener('focus', tooltipRegistry[inputName]);
    input.addEventListener('blur', hideTooltip);
  };

  const remove = () => {
    input.removeEventListener('focus', tooltipRegistry[inputName]);
    delete tooltipRegistry[inputName];
  };

  return { add, remove };
}
