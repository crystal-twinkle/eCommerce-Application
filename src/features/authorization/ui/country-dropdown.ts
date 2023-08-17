import Dropdown, { DropdownType, IDropdownItem } from '../../../shared/ui/dropdown/dropdown';

const countryItems: IDropdownItem[] = [
  {
    value: 'USA',
    content: 'USA',
  },
  {
    value: 'Canada',
    content: 'Canada',
  },
];

const countryDropdown: Dropdown = new Dropdown({
  items: countryItems,
  selectedItemIndex: 0,
  required: true,
  type: DropdownType.FORM,
  styleClass: 'select-country',
});
export default countryDropdown;
