import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { LoginFormName } from './enum/login-form-name';
import { LoginForm } from './model/login-form';

@Injectable()
export class LoginFormBuilderService {
  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _loginForm: FormGroup<LoginForm> = this.prepareForm();

  private prepareForm(): FormGroup<LoginForm> {
    return this.formBuilder.group({
      [LoginFormName.USERNAME]: this.formBuilder.control<string>('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      [LoginFormName.PASSWORD]: this.formBuilder.control<string>('', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
  }

  public get loginForm(): FormGroup<LoginForm> {
    return this._loginForm;
  }

  public get userNameControl(): FormControl<string> {
    return this._loginForm.get(LoginFormName.USERNAME) as FormControl<string>;
  }

  public get passwordControl(): FormControl<string> {
    return this._loginForm.get(LoginFormName.PASSWORD) as FormControl<string>;
  }
}
