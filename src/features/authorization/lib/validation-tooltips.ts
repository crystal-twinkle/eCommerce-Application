function tooltipsText(inputName: string) {
  const tooltips = document.querySelector(`.tooltips`);
  if (inputName === 'email') {
    tooltips.textContent = 'You need to enter a properly formatted email address (like "example@email.com")';
  }
  if (inputName === 'password') {
    tooltips.textContent =
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  }

  if (inputName === 'firstName') {
    tooltips.textContent = 'First name must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'lastName') {
    tooltips.textContent = 'Last name must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'city') {
    tooltips.textContent = 'Must contain at least one character and no special characters or numbers';
  }
  if (inputName === 'street') {
    tooltips.textContent = 'This field must contain at least one character';
  }

  if (inputName === 'postalCode') {
    tooltips.textContent =
      "The format should match the requirements for the selected country, such as '12345' for the U.S. or 'A1B 2C3' for Canada";
  }
}

export default function validationTooltips(input: HTMLElement) {
  const pos = input.getBoundingClientRect();
  const tooltips: HTMLElement = document.querySelector('.tooltips');

  const showTooltip = () => {
    tooltipsText(input.getAttribute('name'));
    tooltips.style.display = 'block';
    tooltips.style.top = `${pos.top + 60}px`;
    tooltips.style.left = `${pos.left}px`;
  };

  const hideTooltip = () => {
    tooltips.style.display = 'none';
  };

  const add = () => {
    input.addEventListener('mouseenter', showTooltip);
    input.addEventListener('mouseleave', hideTooltip);
    input.addEventListener('focus', showTooltip);
    input.addEventListener('blur', hideTooltip);
  };

  const remove = () => {
    input.removeEventListener('mouseenter', showTooltip);
    input.removeEventListener('mouseleave', hideTooltip);
    input.removeEventListener('focus', showTooltip);
    input.removeEventListener('blur', hideTooltip);
  };

  return { add, remove };
}
