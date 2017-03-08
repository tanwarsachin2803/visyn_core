/**
 * Created by Samuel Gratzl on 08.03.2017.
 */
import {IFormParent, IFormElementDesc, FormElementType} from '../interfaces';
import FormSelect from './FormSelect';
import FormSelect2 from './FormSelect2';
import FormInputText from './FormInputText';
import FormMap from './FormMap';


export function create(parent: IFormParent, $parent: d3.Selection<any>, desc: IFormElementDesc) {
  switch (desc.type) {
    case FormElementType.SELECT:
      return new FormSelect(parent, $parent, desc);
    case FormElementType.SELECT2:
      return new FormSelect2(parent, $parent, desc);
    case FormElementType.INPUT_TEXT:
      return new FormInputText(parent, $parent, desc);
    case FormElementType.MAP:
      return new FormMap(parent, $parent, desc);
    default:
      throw new Error('unknown form element type: ' + desc.type);
  }
}
