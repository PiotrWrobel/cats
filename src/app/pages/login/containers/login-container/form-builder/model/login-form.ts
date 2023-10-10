import { FormControl } from '@angular/forms';

import { LoginFormName } from '../enum/login-form-name';

export interface LoginForm {
  [LoginFormName.USERNAME]: FormControl<string>;
  [LoginFormName.PASSWORD]: FormControl<string>;
}
