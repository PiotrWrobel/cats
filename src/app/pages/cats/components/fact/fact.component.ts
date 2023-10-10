import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'cats-fact',
  standalone: true,
  templateUrl: './fact.component.html',
  styleUrls: ['./fact.component.scss'],
  imports: [CardModule, TranslateModule, DividerModule, PanelModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactComponent {
  @Input({ required: true }) public factIndex!: number;
}
