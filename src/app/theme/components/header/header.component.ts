import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { catchError, first, Observable, switchMap } from 'rxjs';

import { UserService } from '~api/services/user/user.service';
import { NavigationService } from '~core/services/navigation/navigation.service';

@Component({
  selector: 'cats-header',
  standalone: true,
  imports: [TranslateModule, ButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly navigationService: NavigationService = inject(NavigationService);

  protected logout(): void {
    this.userService
      .logout()
      .pipe(
        first(),
        catchError(() => this.navigationService.navigateToLoginPage()),
        switchMap(() => this.navigationService.navigateToLoginPage())
      )
      .subscribe();
  }

  protected get isLoggedIn$(): Observable<boolean> {
    return this.userService.isLoggedIn$;
  }
}
