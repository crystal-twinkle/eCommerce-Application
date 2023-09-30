import countryDropdown from '../../../features/authorization/country-dropdown';

const postalCodeMap: Map<string, RegExp> = new Map<string, RegExp>([
  ['US', /^\d{5}(-\d{4})?$/],
  ['Canada', /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/],
]);

export default function validatePostalCode(checkPostalCode: string): boolean {
  const countryDropdownText: string = countryDropdown?.getSelectedText();
  const postalCodePattern: RegExp = postalCodeMap.get(countryDropdownText);
  return postalCodePattern ? postalCodePattern.test(checkPostalCode) : false;
}
