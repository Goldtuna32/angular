import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CifService } from '../../services/cif.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cif-edit',
  imports: [],
  templateUrl: './cif-edit.component.html',
  styleUrl: './cif-edit.component.scss'
})
export class CifEditComponent implements OnInit {
  cifForm!: FormGroup;
  cifId!: number;
  frontNrcFile: File | null = null;
  backNrcFile: File | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cifService: CifService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cifId = Number(this.route.snapshot.paramMap.get('id')); // Get CIF ID from URL

    this.cifForm = this.fb.group({
      name: ['', Validators.required],
      nrcNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      incomeSource: ['', Validators.required],
      branchId: ['', Validators.required],
      frontNrc: [null],
      backNrc: [null]
    });

    this.loadCIFDetails();
  }

 
  loadCIFDetails() {
    this.cifService.getCIFById(this.cifId).subscribe({
      next: (data) => {
        this.cifForm.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load CIF details.';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  
  onFileChange(event: any, type: string) {
    if (type === 'front') {
      this.frontNrcFile = event.target.files[0];
    } else {
      this.backNrcFile = event.target.files[0];
    }
  }

   
  onSubmit() {
    if (this.cifForm.valid) {
      const formData = new FormData();
      Object.keys(this.cifForm.value).forEach((key) => {
        if (key !== 'frontNrc' && key !== 'backNrc') {
          formData.append(key, this.cifForm.value[key]);
        }
      });

      if (this.frontNrcFile) formData.append('frontNrc', this.frontNrcFile);
      if (this.backNrcFile) formData.append('backNrc', this.backNrcFile);

      this.cifService.updateCIF(this.cifId, formData).subscribe({
        next: () => {
          alert('CIF updated successfully!');
          this.router.navigate(['/cifs']); // Redirect back to list
        },
        error: (error) => {
          alert('Failed to update CIF.');
          console.error('Error:', error);
        }
      });
    }
  }
}
