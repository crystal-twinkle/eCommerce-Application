import { Price } from '@commercetools/platform-sdk';

export default function getPrice(price: Price, isDiscounted = false): string {
  let centAmount: number = price.value.centAmount;

  if (isDiscounted) {
    centAmount = price.discounted.value.centAmount;
  }

  const fractionDigits: number = price.value.fractionDigits;
  const currencyCode: string = price.value.currencyCode;
  const shortPrice: number = centAmount / 10 ** fractionDigits;
  return new Intl.NumberFormat(`en-US`, {
    style: 'currency',
    currency: `${currencyCode}`,
  }).format(shortPrice);
}
