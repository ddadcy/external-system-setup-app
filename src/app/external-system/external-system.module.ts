import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { ExternalSystemComponent } from './external-system.component';
import { ExternalSystemService } from './external-system.service';

const routes: Routes = [
  {
    path: '',
    component: ExternalSystemComponent
  },
  {
    path: 'system/:id',
    component: ExternalSystemComponent
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    ExternalSystemComponent
  ],
  providers: [
    ExternalSystemService
  ],
  exports: [
    ExternalSystemComponent
  ]
})
export class ExternalSystemModule { }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ExternalSystemComponent
  ],
  providers: [
    ExternalSystemService
  ],
  exports: [
    ExternalSystemComponent
  ]
})
export class ExternalSystemStandaloneModule { }