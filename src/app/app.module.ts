import { Component } from '@angular/core';
import { ExternalSystemComponent } from './external-system/external-system.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExternalSystemComponent],
  template: `
    <app-external-system></app-external-system>
  `
})
export class AppComponent {
}