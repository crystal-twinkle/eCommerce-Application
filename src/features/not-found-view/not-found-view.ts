import './not-found-view.scss';
import ViewBuilder from '../../shared/lib/view-builder';
import ElementBuilder from '../../shared/lib/element-builder';
import Button, { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/button';

export default class NotFoundView extends ViewBuilder {
  constructor() {
    super('not-found-view');
  }

  public configureView(): HTMLElement[] {
    this.wrapper.setStyleClass('wrapper not-found-view__wrapper');

    const contentContainer = new ElementBuilder({
      tag: 'div',
      styleClass: 'not-found-view__content-container',
    });

    const imageFirst = new ElementBuilder({
      tag: 'div',
      styleClass: 'not-found-view__image_first',
    });

    const imageSecond = new ElementBuilder({
      tag: 'div',
      styleClass: 'not-found-view__image_second',
    });

    const noPageText = new ElementBuilder({
      tag: 'h1',
      styleClass: 'not-found-view__heading',
      content: 'No such page =(',
    });

    contentContainer.getElement().append(imageFirst.getElement(), noPageText.getElement());

    const overviewButton = new Button(
      () => {},
      'Catalog',
      ButtonType.CIRCLE,
      { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
      ButtonSize.BIG,
    );

    overviewButton.getElement().classList.add('button-container');

    return [contentContainer.getElement(), imageSecond.getElement(), overviewButton.getElement()];
  }
}
