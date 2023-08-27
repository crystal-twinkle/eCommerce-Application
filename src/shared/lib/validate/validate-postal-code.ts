import countryDropdown from '../../../features/authorization/ui/country-dropdown';

export default function validatePostalCode(checkPostalCode: string): boolean {
  const countryDropdownText: string = countryDropdown?.getSelectedItem()?.content;
  let postalCodePattern: RegExp;

  if (countryDropdownText === 'US' || countryDropdownText === 'Canada') {
    if (countryDropdownText === 'US') {
      postalCodePattern = /^\d{5}(-\d{4})?$/;
    }
    if (countryDropdownText === 'Canada') {
      postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    }
    return postalCodePattern.test(checkPostalCode);
  }

  return false;
}
