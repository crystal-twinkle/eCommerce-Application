import countryDropdown from '../../../features/authorization/ui/country-dropdown';

function validateAddress() {
  const street = (checkStreet: string): boolean => {
    return checkStreet.trim().length > 0;
  };

  const city = (checkCity: string): boolean => {
    const cityPattern = /^[A-Za-z\s]+$/;
    return cityPattern.test(checkCity);
  };

  const postalCode = (checkPostalCode: string): boolean => {
    const countryDropdownText = countryDropdown?.getSelectedItem()?.content;
    let postalCodePattern: RegExp;
    if (countryDropdownText === 'USA') {
      postalCodePattern = /^\d{5}(-\d{4})?$/;
    }
    if (countryDropdownText === 'Canada') {
      postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    }
    return postalCodePattern.test(checkPostalCode);
  };

  return { street, city, postalCode };
}

export default validateAddress();
