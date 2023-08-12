import ElementBuilder from '../../shared/lib/element-builder';
import OptionBuilder from '../../shared/ui/option/option-builder';

const countrySelectBuild = new ElementBuilder({
  tag: 'select',
  tagSettings: { id: 'country', name: 'country' },
});

const defaultOption = new OptionBuilder({
  content: 'Select country:',
}).getElement();

const usaOption = new OptionBuilder({
  value: 'USA',
  content: 'USA',
}).getElement();

const canadaOption = new OptionBuilder({
  value: 'Canada',
  content: 'Canada',
}).getElement();

defaultOption.setAttribute('disabled', 'disabled');
defaultOption.setAttribute('selected', 'selected');
const countrySelect = countrySelectBuild.append([defaultOption, usaOption, canadaOption]).getElement();
export default countrySelect;
