import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalSystemComponent } from './external-system.component';

const routes: Routes = [
  {
    path: '',
    component: ExternalSystemComponent,
    data: { 
      title: 'External Systems',
      breadcrumb: 'External Systems'
    }
  },
  {
    path: 'create',
    component: ExternalSystemComponent,
    data: { 
      title: 'Create External System',
      breadcrumb: 'Create System',
      mode: 'create'
    }
  },
  {
    path: ':id',
    component: ExternalSystemComponent,
    data: { 
      title: 'External System Details',
      breadcrumb: 'System Details',
      mode: 'view'
    }
  },
  {
    path: ':id/edit',
    component: ExternalSystemComponent,
    data: { 
      title: 'Edit External System',
      breadcrumb: 'Edit System',
      mode: 'edit'
    }
  },
//   {
//     path: ':id/planners',
//     loadChildren: () => import('./planners/planners.module').then(m => m.PlannersModule),
//     data: { 
//       title: 'System Planners',
//       breadcrumb: 'Planners'
//     }
//   },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalSystemRoutingModule { }