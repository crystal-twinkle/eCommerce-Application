export enum SortButtonType {
  PRICE = 'Price',
  POPULARITY = 'Popularity',
}

export enum SortCriteria {
  BEST,
  WORST,
}

export interface SortButtonCallbackValue {
  type: SortButtonType;
  sortCriteria: SortCriteria;
}
