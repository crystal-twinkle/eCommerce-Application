import ElementBuilder from '../../shared/lib/element-builder';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';
import './showcases.scss';

export default class ShowcasesPage {
  private builder: ElementBuilder;

  constructor() {
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'showcases',
    });

    const defaultButtom = new Button(() => {}, 'Default button');
    const buttonWithoutBorders = new Button(() => {}, 'Button without borders', ButtonType.DEFAULT_WITHOUT_BORDER);
    const buttonWithIconAndLeftPosition = new Button(
      () => {},
      'button With Icon And Left Position',
      ButtonType.DEFAULT,
      { name: 'arrow-right', position: ButtonIconPosition.LEFT },
    );
    const buttonWithIconAndRightPosition = new Button(
      () => {},
      'button colored with Icon And Right Position',
      ButtonType.DEFAULT_COLORED,
      { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
    );
    const circleButtonWithBorderBig = new Button(
      () => {},
      'circle With Border Big',
      ButtonType.CIRCLE,
      null,
      ButtonSize.BIG,
    );
    const circleButtonColoredMedium = new Button(
      () => {},
      'circle colored medium',
      ButtonType.CIRCLE_COLORED,
      null,
      ButtonSize.MEDIUM,
    );
    const circleButtonWithoutBorderSmall = new Button(
      () => {},
      '',
      ButtonType.CIRCLE_WITHOUT_BORDER,
      { name: 'heart', position: ButtonIconPosition.LEFT },
      ButtonSize.SMALL,
    );

    this.builder.append([
      defaultButtom.getElement(),
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
