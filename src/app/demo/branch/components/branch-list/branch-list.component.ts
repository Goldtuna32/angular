import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-list',
  imports: [ CommonModule],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent {
  branches: any[] = []; // Stores the list of branches
  loading = true; // Loading state
  errorMessage = ''; // Error message if API fails

  constructor(private branchService: BranchService, private router: Router) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  // ✅ Fetch branches from backend
  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (data) => {
        this.branches = data;
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
    this.router.navigate(['/branches/edit', id]); // Navigate to edit page
  }

  // ✅ Delete branch
  deleteBranch(id: number) {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branchService.deleteBranch(id).subscribe({
        next: () => {
          alert('Branch deleted successfully.');
          this.loadBranches(); // Reload after delete
        },
        error: (error) => {
          alert('Failed to delete branch.');
          console.error('Error deleting branch:', error);
        }
      });
    }
  }
}
