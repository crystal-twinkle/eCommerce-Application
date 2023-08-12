function validate() {
  const street = (checkStreet: string): boolean => {
    return checkStreet.trim().length > 0;
  };

  const city = (checkCity: string): boolean => {
    const cityPattern = /^[A-Za-z\s]+$/;
    return cityPattern.test(checkCity);
  };

  const postalCode = (checkPostalCode: string, checkCountry: string): boolean => {
    let postalCodePattern: RegExp;
    if (checkCountry === 'USA') {
      postalCodePattern = /^\d{5}(?:-\d{4})?$/;
    }

    if (checkCountry === 'Canada') {
      postalCodePattern = /^\d{5}(?:-\d{4})?$/;
    }

    return postalCodePattern.test(checkPostalCode);
  };

  return { street, city, postalCode };
}

export default validate;
