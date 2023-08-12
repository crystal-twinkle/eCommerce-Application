interface IElementEvent {
  type: string;
  callback: (event: Event) => void;
}

interface IElementBuilderConfig {
  tag: string;
  tagSettings?: { [id: string]: string }; // for specific tag input, button etc
  content?: string;
  styleClass?: string;
  event?: IElementEvent;
  disabled?: boolean;
}

export default class ElementBuilder {
  private readonly element: HTMLElement;

  constructor(config: IElementBuilderConfig) {
    this.element = document.createElement(config.tag);
    this.setContent(config.content);
    this.setStyleClass(config.styleClass);
    this.setEventHandler(config.event);
    this.setTagSettings(config.tagSettings);
    if (typeof config.disabled === 'boolean') {
      config.disabled ? this.disable() : this.enable();
    }
  }

  public setContent(value: string = ''): ElementBuilder {
    this.element.innerHTML = value;
    return this;
  }

  public setStyleClass(value: string = ''): ElementBuilder {
    this.element.className = value;
    return this;
  }

  public setEventHandler(event: IElementEvent): ElementBuilder {
    if (event) {
      this.element.addEventListener(event.type, event.callback);
    }
    return this;
  }

  public setTagSettings(tagSettings: { [id: string]: string }): ElementBuilder {
    if (tagSettings) {
      Object.keys(tagSettings).forEach((key: string) => this.element.setAttribute(key, tagSettings[key]));
    }
    return this;
  }

  public append(nodes: HTMLElement[]): ElementBuilder {
    this.element.append(...nodes);
    return this;
  }

  public prepend(nodes: HTMLElement[]): ElementBuilder {
    this.element.prepend(...nodes);
    return this;
  }

  public enable(): ElementBuilder {
    (this.element as HTMLInputElement).disabled = false;
    return this;
  }

  public disable(): ElementBuilder {
    (this.element as HTMLInputElement).disabled = true;
    return this;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
