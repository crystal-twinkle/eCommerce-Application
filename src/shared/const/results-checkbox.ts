export interface IResultsCheckbox {
  billDefault: boolean;
  shipDefault: boolean;
  shipAsBill?: boolean;
  shipDelete?: boolean;
  billDelete?: boolean;
  shipDefaultExist?: boolean;
  billDefaultExist?: boolean;
  shipUse?: boolean;
  billUse?: boolean;
  [key: string]: boolean;
}
