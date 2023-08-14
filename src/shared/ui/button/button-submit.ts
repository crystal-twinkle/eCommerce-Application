import Button, { ButtonSize } from './button';

class ButtonSubmit extends Button {
  constructor() {
    super(() => {}, 'Submit', true, 'arrow-right', false, ButtonSize.SMALL);
  }
}
export default ButtonSubmit;
