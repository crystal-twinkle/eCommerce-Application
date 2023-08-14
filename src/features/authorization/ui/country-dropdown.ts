import Dropdown, { DropdownItem } from '../../../shared/ui/dropdown/dropdown';

const countryItems: DropdownItem[] = [
  {
    value: '',
    content: 'Select country:',
  },
  {
    value: 'USA',
    content: 'USA',
  },
  {
    value: 'Canada',
    content: 'Canada',
  },
];

const countryDropdown = <HTMLSelectElement>new Dropdown(countryItems).getElement();
countryDropdown.required = true;
countryDropdown.classList.add('select-country');
export default countryDropdown;
