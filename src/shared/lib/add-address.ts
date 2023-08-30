import ElementBuilder from './element-builder';
import Input from '../ui/input/input';
import InputPostalCode from '../ui/input/input-postal-code';

export default function addAddress(
  dataElements: string[],
  elementAppend: ElementBuilder,
  titleText: string,
): HTMLInputElement[] {
  const title = new ElementBuilder({ tag: 'h4', content: titleText }).getElement();
  const addressElements: HTMLInputElement[] = [];
  const [city, street, postalCode] = dataElements;
  addressElements.push(
    new Input({
      placeholder: 'City',
      value: city,
      name: 'city',
    }).getElement(),
    new Input({
      placeholder: 'Street',
      value: street,
      name: 'street',
    }).getElement(),
    new InputPostalCode({ value: postalCode }).getElement(),
  );
  elementAppend.append([title, ...addressElements]);
  return addressElements;
}
