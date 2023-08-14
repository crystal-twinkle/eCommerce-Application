function validateAddress() {
  const street = (checkStreet: string): boolean => {
    return checkStreet.trim().length > 0;
  };

  const city = (checkCity: string): boolean => {
    const cityPattern = /^[A-Za-z\s]+$/;
    return cityPattern.test(checkCity);
  };

  const postalCode = (checkPostalCode: string): boolean => {
    const postalCodePattern = /^\d{5}(?:-\d{4})?$/;
    return postalCodePattern.test(checkPostalCode);
  };

  return { street, city, postalCode };
}

export default validateAddress();
