import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
 
@Component({
  selector: 'app-branch-list',
  imports: [ CommonModule, MatPaginator, MatSort, MatTableModule ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent {
  displayedColumns: string[] = ['branchCode', 'branchName', 'phoneNumber', 'email', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private branchService: BranchService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load branches. Please try again.';
        console.error('Error fetching branches:', error);
        this.loading = false;
      }
    });
  }

  editBranch(id: number) {
    this.router.navigate(['/branches/edit', id]);
  }

  deleteBranch(id: number) {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branchService.deleteBranch(id).subscribe({
        next: () => {
          this.snackBar.open('Branch deleted successfully.', 'Close', { duration: 3000 });
          this.loadBranches();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete branch.', 'Close', { duration: 3000 });
          console.error('Error deleting branch:', error);
        }
      });
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/branches/details', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
