import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalSystemComponent } from './external-system/external-system.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExternalSystemComponent],
  template:`
    <app-external-system></app-external-system>
  `
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    console.info('App Component Initialized!');
  }
}