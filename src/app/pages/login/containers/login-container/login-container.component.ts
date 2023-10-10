import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, first, Observable, switchMap, takeWhile } from 'rxjs';

import { UserService } from '~api/services/user/user.service';
import { NavigationService } from '~core/services/navigation/navigation.service';

import { LoginFormBuilderService } from './form-builder/login-form-builder.service';
import { LoginForm } from './form-builder/model/login-form';

@Component({
  selector: 'cats-login-container',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ChipsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RippleModule,
    ToastModule
  ],
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
  providers: [LoginFormBuilderService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainerComponent implements OnInit {
  private readonly formService: LoginFormBuilderService = inject(LoginFormBuilderService);
  private readonly navigationService: NavigationService = inject(NavigationService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly userService: UserService = inject(UserService);
  private readonly titleService: Title = inject(Title);

  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    this.titleService.setTitle(this.translateService.instant('login.title'));

    this.userService.isLoggedIn$
      .pipe(
        takeWhile((isLoggedIn: boolean) => isLoggedIn),
        switchMap(() => this.userService.logout()),
        first()
      )
      .subscribe();
  }

  protected login(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.userService
        .login({
          username: this.userNameControl.value,
          password: this.passwordControl.value
        })
        .pipe(
          first(),
          switchMap(() => this.navigationService.navigateToCatsPage())
        )
        .subscribe({
          error: (error: HttpErrorResponse) => this.handleLoginError(error)
        });
    }
  }

  private handleLoginError(error: HttpErrorResponse) {
    if (error.status === HttpStatusCode.Unauthorized) {
      this.messageService.add({
        severity: 'error',
        detail: this.translateService.instant('errors.invalid-login')
      });
    } else {
      this.messageService.add({
        severity: 'error',
        detail: this.translateService.instant('errors.load-data-failed')
      });
    }
  }

  protected get form(): FormGroup<LoginForm> {
    return this.formService.loginForm;
  }

  protected get userNameControl(): FormControl<string> {
    return this.formService.userNameControl;
  }

  protected get passwordControl(): FormControl<string> {
    return this.formService.passwordControl;
  }

  protected get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }
}
