import Input from '../ui/input/input';
import ElementBuilder from './element-builder';
import { IResultsCheckbox } from '../const/results-checkbox';

export default function addCheckbox(resultsCheckbox: IResultsCheckbox) {
  const call = (parameter: string, content: string): HTMLElement => {
    const useCheckbox = new Input({ type: 'checkbox' }).getElement();
    useCheckbox.addEventListener('change', () => {
      // eslint-disable-next-line no-param-reassign
      resultsCheckbox[parameter] = useCheckbox.checked;
    });
    return new ElementBuilder({
      tag: 'div',
    })
      .append([
        useCheckbox,
        new ElementBuilder({
          tag: 'span',
          content,
        }).getElement(),
      ])
      .getElement();
  };
  return { call };
}
