export interface IDropdownItem<T = unknown> {
  value: string;
  content: string;
  data?: T;
}

export interface IDropdownConfig {
  items: IDropdownItem[];
  selectedItemIndex?: number;
  callback?: (selectedItem: IDropdownItem) => void;
  placeholder?: string;
  type?: DropdownType;
  required?: boolean;
  styleClass?: string;
}

export enum DropdownType {
  DEFAULT = '',
  FORM = 'form',
}
