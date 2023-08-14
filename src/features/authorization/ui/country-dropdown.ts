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

const countryDropdown = new Dropdown(countryItems).getElement();
export default countryDropdown;
