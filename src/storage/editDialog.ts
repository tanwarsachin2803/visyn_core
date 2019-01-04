import {IStoredNamedSet} from './interfaces';
import {FormDialog} from 'phovea_ui/src/dialogs';
import {ISecureItem} from 'phovea_core/src/security';
import {permissionForm} from '../internal/utils';

export default function editDialog(namedSet: IStoredNamedSet, result: (name: string, description: string, sec: Partial<ISecureItem>) => void) {
  const isCreate = namedSet === null;
  const title = isCreate ? 'Save' : 'Edit';
  const dialog = new FormDialog(title + ' List of Entities', title, 'namedset_form');

  const permissions = permissionForm(namedSet);

  dialog.form.innerHTML = `
    <div class="form-group">
      <label for="namedset_name">Name</label>
      <input type="text" class="form-control" name="name" id="namedset_name" placeholder="Name" required="required" ${namedSet ? `value="${namedSet.name}"` : ''}>
    </div>
    <div class="form-group">
      <label for="namedset_description">Description</label>
      <textarea class="form-control" name="description" id="namedset_description" rows="5" placeholder="Description">${namedSet ? namedSet.description : ''}</textarea>
    </div>
    ${permissions.template}
  `;

  dialog.onHide(() => dialog.destroy());

  dialog.onSubmit(() => {
    const data = new FormData(dialog.form);
    const name = data.get('name').toString();
    const description = data.get('description').toString();
    const sec = permissions.resolve(data);

    result(name, description, sec);
    dialog.hide();
    return false;
  });

  dialog.show();
}
