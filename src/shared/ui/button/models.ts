export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
}

export enum ButtonType {
  DEFAULT = '',
  AS_TEXT = 'as-text',
  DEFAULT_WITHOUT_BORDER = 'without-border',
  DEFAULT_COLORED = 'colored',
  CIRCLE = 'circle',
  CIRCLE_WITHOUT_BORDER = 'circle _without-border',
  CIRCLE_COLORED = 'circle _colored',
}

export enum ButtonIconPosition {
  RIGHT,
  LEFT,
}

export interface IButtonIconConfig {
  name: string;
  position?: ButtonIconPosition;
}

export interface IButtonConfig {
  type: ButtonType;
  callback?: () => void;
  text?: string;
  icon?: IButtonIconConfig;
  size?: ButtonSize | string;
  styleClass?: string;
}
