function validateAddress() {
  const street = (checkStreet: string): boolean => {
    return checkStreet.trim().length > 0;
  };

  const city = (checkCity: string): boolean => {
    const cityPattern = /^[A-Za-z\s]+$/;
    return cityPattern.test(checkCity);
  };

  const postalCode = (checkPostalCode: string): boolean => {
    // const selectCountry = <HTMLSelectElement>document.querySelector('.select-country');
    const selectCountryText = document.querySelector('.select-country').querySelector('span').textContent;
    if (selectCountryText === 'USA' || selectCountryText === 'Canada') {
      let postalCodePattern: RegExp;
      if (selectCountryText === 'USA') {
        postalCodePattern = /^\d{5}(-\d{4})?$/;
      }
      if (selectCountryText === 'Canada') {
        postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
      }
      return postalCodePattern.test(checkPostalCode);
    }
    console.log(selectCountryText);
    return false;
  };

  return { street, city, postalCode };
}

export default validateAddress();
