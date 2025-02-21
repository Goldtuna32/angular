import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentAccountRoutingModule } from './current-account-routing.module';

// Import standalone components
import { AccountCreateComponent } from './components/account-create/account-create.component';
import { AccountListComponent } from './components/account-list/account-list.component';

@NgModule({
  imports: [
    CommonModule,
    CurrentAccountRoutingModule,
    AccountCreateComponent,
    AccountListComponent
  ]
})
export class CurrentAccountModule {}
