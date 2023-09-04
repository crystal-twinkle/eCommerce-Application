export enum SortButtonType {
  PRICE = 'Price',
  ALPHABET = 'Alphabet',
}

export enum SortCriteria {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortButtonCallbackValue {
  type: SortButtonType;
  sortCriteria: SortCriteria;
}
