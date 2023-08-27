import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import './showcases.scss';
import Dropdown, { DropdownType, IDropdownItem } from '../../shared/ui/dropdown/dropdown';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';

export default class ShowcasesPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'showcases',
    });

    const dropdownItems: IDropdownItem[] = [
      {
        value: 'USA',
        content: 'USA',
      },
      {
        value: 'Canada',
        content: 'Canada',
      },
    ];
    const defaultDropdown = new Dropdown({
      items: dropdownItems,
      type: DropdownType.DEFAULT,
    });
    const formDropdown = new Dropdown({
      items: dropdownItems,
      type: DropdownType.FORM,
    });
    const defaultButton = new Button({
      callback: () => {},
      text: 'Default button',
      type: ButtonType.DEFAULT_COLORED,
    });
    const buttonWithoutBorders = new Button({
      callback: () => {},
      text: 'Button without borders',
      type: ButtonType.DEFAULT_WITHOUT_BORDER,
    });
    const buttonWithIconAndLeftPosition = new Button({
      callback: () => {},
      text: 'button With Icon And Left Position',
      type: ButtonType.DEFAULT,
      icon: { name: 'arrow-right', position: ButtonIconPosition.LEFT },
    });
    const buttonWithIconAndRightPosition = new Button({
      callback: () => {},
      text: 'button colored with Icon And Right Position',
      type: ButtonType.DEFAULT_COLORED,
      icon: { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
    });
    const circleButtonWithBorderBig = new Button({
      callback: () => {},
      text: 'circle With Border Big',
      type: ButtonType.CIRCLE,
      size: ButtonSize.BIG,
    });
    const circleButtonColoredMedium = new Button({
      callback: () => {},
      text: 'circle colored medium',
      type: ButtonType.CIRCLE_COLORED,
      size: ButtonSize.MEDIUM,
    });
    const circleButtonWithoutBorderSmall = new Button({
      callback: () => {},
      type: ButtonType.CIRCLE_WITHOUT_BORDER,
      icon: { name: 'heart', position: ButtonIconPosition.LEFT },
      size: ButtonSize.SMALL,
    });

    this.builder.append([
      formDropdown.getElement(),
      defaultDropdown.getElement(),
      defaultButton.getElement(),
      buttonWithoutBorders.getElement(),
      buttonWithIconAndLeftPosition.getElement(),
      buttonWithIconAndRightPosition.getElement(),
      circleButtonWithBorderBig.getElement(),
      circleButtonColoredMedium.getElement(),
      circleButtonWithoutBorderSmall.getElement(),
    ]);
  }

  public getElement(): HTMLElement {
    return this.builder.getElement();
  }
}
