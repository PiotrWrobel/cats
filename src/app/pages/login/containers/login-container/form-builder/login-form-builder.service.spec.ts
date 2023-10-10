import { FormControl, Validators } from '@angular/forms';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { LoginFormBuilderService } from './login-form-builder.service';

describe('LoginFormBuilderService', () => {
  let service: LoginFormBuilderService;

  beforeEach(async () => {
    await MockBuilder(LoginFormBuilderService);
    service = ngMocks.get(LoginFormBuilderService);
  });

  describe('service init', () => {
    it('should create LoginFormBuilderService', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('create login form', () => {
    it('should create user name control', () => {
      const userNameControl: FormControl<string> = service.userNameControl;
      expect(userNameControl.hasValidator(Validators.required)).toBeTrue();
      expect(userNameControl.updateOn).toBe('blur');
    });

    it('should create username control', () => {
      const passwordControl: FormControl<string> = service.passwordControl;
      expect(passwordControl.hasValidator(Validators.required)).toBeTrue();
      expect(passwordControl.updateOn).toBe('blur');
    });
  });
});
