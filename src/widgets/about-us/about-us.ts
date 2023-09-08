import CommonBuilderWrapper from '../../shared/lib/common-builder-wrapper';
import ElementBuilder from '../../shared/lib/element-builder';

export default class AboutUs extends CommonBuilderWrapper {
  private readonly aboutMember: ElementBuilder;
  private readonly img: ElementBuilder;
  constructor() {
    super();
    this.builder = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us',
    });

    this.img = new ElementBuilder({
      tag: 'img',
      styleClass: 'about-us__img',
      tagSettings: {
        alt: 'Member image',
      },
    });
    this.aboutMember = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us__member',
    });
    this.builder.append([this.aboutUsIntroduction().getElement()]);
  }

  public aboutUsIntroduction(): ElementBuilder {
    const aboutUsIntroductionText =
      'Behind the success of our exceptional product lies a team of dedicated professionals who have seamlessly merged their talents and expertise to transform our vision into reality. Each member of our team has played an integral role in the development of our innovative product. ';
    return new ElementBuilder({
      tag: 'span',
      content: aboutUsIntroductionText,
    });
  }
}
