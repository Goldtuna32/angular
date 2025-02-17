import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchRoutingModule } from './branch-routing.module';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { BranchCreateComponent } from './components/branch-create/branch-create.component';

@NgModule({
  imports: [
    CommonModule,
    BranchRoutingModule,
    BranchListComponent,  // ✅ Import standalone component
    BranchCreateComponent // ✅ Import standalone component
  ]
})
export class BranchModule { }
