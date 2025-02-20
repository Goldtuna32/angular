// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'branch/create',
        loadComponent: () => import('./demo/branch/components/branch-create/branch-create.component')
          .then(m => m.BranchCreateComponent)
      },
      {
        path: 'branch/list',
        loadComponent: () => import('./demo/branch/components/branch-list/branch-list.component')
          .then(m => m.BranchListComponent)
      },
      {
        path: 'cif/create',
        loadComponent: () => import('./demo/cif/components/cif-create/cif-create.component')
          .then(m => m.CifCreateComponent)
      },
      { 
        path: 'cif/list',
        loadComponent: () => import('./demo/cif/components/cif-list/cif-list.component')
          .then(m => m.CifListComponent)
      },
      { 
        path: 'cif/edit/:id',
        loadComponent: () => import('./demo/cif/components/cif-edit/cif-edit.component')
          .then(m => m.CifEditComponent)
      }

    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
