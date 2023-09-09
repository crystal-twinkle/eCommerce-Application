import ElementBuilder from '../../shared/lib/element-builder';
import './about-us.scss';
import ViewBuilder from '../../shared/lib/view-builder';

export default class AboutUs extends ViewBuilder {
  constructor() {
    super('about-us-content');
  }

  public configureView(): HTMLElement[] {
    const aboutUs = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us',
    });
    aboutUs.append([this.aboutUsIntroduction(), this.aboutSiarhei(), this.aboutKrystina(), this.aboutRoman()]);
    return [aboutUs.getElement()];
  }

  public aboutUsIntroduction(): HTMLElement {
    const introductionDiv = new ElementBuilder({ tag: 'div', styleClass: 'about-us__introduction' });
    const aboutUsIntroductionText = `Behind the success of our exceptional product lies a team of dedicated professionals who have seamlessly merged their talents and expertise to transform our vision into reality. Each member of our team has played an integral role in the development of our innovative product. 
    <br> These are also all our current photos; we're just located behind the trees :)`;

    const contributionText = `<br> Each participant in this project made a valuable contribution:
      <li> Roman focused on configuring the navigation and the catalog page, ensuring that users can easily find their way around the website.</li>
    <li> Siarhei took charge of creating the main page and meticulously crafted product cards, making them visually appealing and informative.</li>
    <li> Krystina played a crucial role by developing forms and the user profile functionality, ensuring a smooth and user-friendly experience for those interacting with the website.</li>
    Together, their efforts combined to create a well-rounded and functional project, showcasing the strengths and skills of each team member! :)`;

    const contributionDiv = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us__contribution',
      content: contributionText,
    }).getElement();

    const aboutUsIntroduction = new ElementBuilder({
      tag: 'span',
      content: aboutUsIntroductionText,
    }).getElement();
    return introductionDiv.append([aboutUsIntroduction, contributionDiv]).getElement();
  }

  public aboutMember(name: string, aboutMemberText: string, href: string): HTMLElement {
    const aboutMemberDiv = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us__member',
    });
    const aboutBioWrap = new ElementBuilder({ tag: 'div', styleClass: 'about-us__bio-wrap' });
    const dataName = name.split(' ')[0];
    const aboutImg = new ElementBuilder({
      tag: 'div',
      styleClass: 'about-us__img',
      tagSettings: {
        'data-photo': dataName,
      },
    }).getElement();
    const githubLink = new ElementBuilder({
      tag: 'a',
      content: dataName,
      tagSettings: {
        href,
      },
    }).getElement();

    const aboutMemberBio = new ElementBuilder({
      tag: 'span',
      content: `${aboutMemberText} <br> <strong> GitHub Profile: </strong>`,
    })
      .append([githubLink])
      .getElement();
    aboutBioWrap.append([aboutImg, aboutMemberBio]);
    const aboutMemberTitle = new ElementBuilder({
      tag: 'h3',
      content: name,
    }).getElement();
    return aboutMemberDiv.append([aboutMemberTitle, aboutBioWrap.getElement()]).getElement();
  }

  public aboutSiarhei(): HTMLElement {
    const aboutSergeyText = `<strong> Job </strong> : Veterinarian. <br> <strong> BIO </strong> Sergey's impressive skills and contributions are the key to our product's exceptional user experience. Her dedication to crafting responsive, interactive, and aesthetically pleasing interfaces has a profound impact on our product's success. He works as a veterinarian. 
    <br> <strong> A story from Sergey's life: </strong> Once, he embarked on a mission to rescue elephant calves left motherless by poachers. He cared for and nurtured the fragile young elephants, nursing them back to health and providing them with a second chance at life. This is the heartwarming tale from Sergey's life.`;
    return this.aboutMember('Siarhei Yarotski', aboutSergeyText, 'https://github.com/sadjoebright');
  }

  public aboutKrystina(): HTMLElement {
    const aboutKrystinaText = `<strong> Job </strong> : Actress. <br> <strong> BIO </strong> Krystina's coding prowess is legendary within the team. Her deep technical insights and commitment to excellence have been instrumental in shaping our product's core functionality.
    <br> <strong> A story from Krystina's life: </strong> One day, she was walking in the forest when she spotted a baby hedgehog in the grass. Christina noticed that a piece of plastic packaging was tangled in its quills. She carefully freed the hedgehog and discovered that it was trembling from fear and hunger. She made the decision to temporarily care for the hedgehog. After it grew older, Christina released it back into the forest.`;
    return this.aboutMember('Krystsina Valadzko', aboutKrystinaText, 'https://github.com/kristalik8');
  }

  public aboutRoman(): HTMLElement {
    const aboutRomanText = `<strong> Job </strong> : Woodworker. <br> <strong> BIO </strong> Roman is the driving force behind our product's technical excellence. His strategic thinking and leadership have been instrumental in shaping our success.<br> <strong> A story from Roman's life: </strong> it was a day of heavy rain in the city where Roman lived. He was sitting at home when he heard the meowing of kittens coming from the basement. 
    He went downstairs and saw that the basement was filled with water. In the end, Roman not only saved the kittens but also secured them a safe and loving place to call home.`;
    return this.aboutMember('Roman Kravchenko', aboutRomanText, 'https://github.com/gemer31');
  }
}
