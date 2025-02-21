import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCreateComponent } from './components/account-create/account-create.component';
import { AccountListComponent } from './components/account-list/account-list.component';

const routes: Routes = [
  {path: 'account-create', component: AccountCreateComponent},
  {path: 'account-list', component: AccountListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentAccountRoutingModule { }
