import Button, { ButtonIconPosition, ButtonType } from './button';

class ButtonSubmit extends Button {
  constructor() {
    super(() => {}, 'Submit', ButtonType.DEFAULT_COLORED, { name: 'arrow-right', position: ButtonIconPosition.RIGHT });
  }
}

export default ButtonSubmit;
