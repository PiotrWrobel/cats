import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MessageService } from 'primeng/api';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, first, Observable } from 'rxjs';

import { CatInformationService } from '~api/services/cat-information/cat-information.service';
import { GetCatsDataResponse } from '~api/services/cat-information/model/get-cats-data-response';

import { FactComponent } from '../../components/fact/fact.component';

@Component({
  selector: 'cats-cats-container',
  standalone: true,
  imports: [FactComponent, CommonModule, InfiniteScrollModule, ToastModule, TranslateModule, ScrollTopModule],
  templateUrl: './cats-container.component.html',
  styleUrls: ['./cats-container.component.scss'],
  providers: [CatInformationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatsContainerComponent implements OnInit {
  private readonly catsInformationService: CatInformationService = inject(CatInformationService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly title: Title = inject(Title);

  private readonly _facts$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private static readonly LOAD_COUNT: number = 10;

  public ngOnInit(): void {
    this.title.setTitle(this.translateService.instant('cats.title'));
    this.loadData();
  }

  protected onScrolled(): void {
    this.loadData();
  }

  private loadData(): void {
    this.catsInformationService
      .getCatsData(CatsContainerComponent.LOAD_COUNT)
      .pipe(first())
      .subscribe({
        next: (response: GetCatsDataResponse) => {
          const facts: string[] = this._facts$.getValue();
          const filteredData: string[] = response.data.filter((data: string) => !facts.includes(data));

          this._facts$.next([...facts, ...filteredData]);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            detail: this.translateService.instant('errors.load-data-failed')
          })
      });
  }

  public get facts$(): Observable<string[]> {
    return this._facts$.asObservable();
  }
}
