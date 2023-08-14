export default function validationError(errorInp: HTMLElement) {
  const updatedErrorInp = errorInp;
  const errorName = errorInp.getAttribute('name');
  const errorMessage = <HTMLElement>document.querySelector(`[data-id="error-${errorName}"]`);
  const show = () => {
    const iElem = document.createElement('i');
    iElem.textContent = '!';
    updatedErrorInp.appendChild(iElem);
    updatedErrorInp.style.borderBottom = '4px solid red';
    errorMessage.style.display = 'block';
  };

  const hid = () => {
    updatedErrorInp.style.borderBottom = '';
    errorMessage.style.display = 'none';
  };

  return { show, hid };
}
