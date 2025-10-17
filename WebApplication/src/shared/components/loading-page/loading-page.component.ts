import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'loading-page',
  templateUrl: 'loading-page.component.html',
  imports: [TranslateModule],
  styleUrls: ['./loading-page.styles.css']
})
export class LoadingPageComponent {
}
