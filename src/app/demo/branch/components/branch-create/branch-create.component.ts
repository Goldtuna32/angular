import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-branch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-create.component.html',
  styleUrl: './branch-create.component.scss'
})
export class BranchCreateComponent {
  branchForm: FormGroup;

  constructor(private fb: FormBuilder, private branchService: BranchService) {
    this.branchForm = this.fb.group({
      branchName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      town: ['', Validators.required],
      street: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Getter for form controls
  get f() {
    return this.branchForm.controls;
  }

  // Handle form submission
  onSubmit() {
    if (this.branchForm.valid) {
      this.branchService.createBranch(this.branchForm.value).subscribe({
        next: (response) => {
          console.log('Branch created successfully:', response);
          alert('Branch created successfully!');
          this.branchForm.reset();
        },
        error: (error) => {
          console.error('Error creating branch:', error);
          alert('Failed to create branch. Please try again.');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}