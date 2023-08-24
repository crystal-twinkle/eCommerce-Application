import './not-found-view.scss';
import ViewBuilder from '../../shared/lib/view-builder';
import ElementBuilder from '../../shared/lib/element-builder';
import Button from '../../shared/ui/button/button';
import { Page } from '../../shared/lib/router/pages';
import appRouter from '../../shared/lib/router/router';
import { ButtonIconPosition, ButtonSize, ButtonType } from '../../shared/ui/button/models';

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

    const overviewButton = new Button({
      callback: () => appRouter.navigate(Page.OVERVIEW),
      text: 'Catalog',
      type: ButtonType.CIRCLE,
      icon: { name: 'arrow-right', position: ButtonIconPosition.RIGHT },
      size: ButtonSize.BIG,
    });

    overviewButton.getElement().classList.add('button-container');

    return [contentContainer.getElement(), imageSecond.getElement(), overviewButton.getElement()];
  }
}
