export enum SortButtonType {
  PRICE = 'Price',
  ALPHABET = 'Alphabet',
}

export enum SortCriteria {
  BEST,
  WORST,
}

export interface SortButtonCallbackValue {
  type: SortButtonType;
  sortCriteria: SortCriteria;
}
