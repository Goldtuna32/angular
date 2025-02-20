import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CifService } from '../../services/cif.service';
import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cif-create',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './cif-create.component.html',
  styleUrl: './cif-create.component.scss'
})
export class CifCreateComponent {
  cifForm!: FormGroup;
  branches: any[] = [];  // Stores Branch List
  nrcFormats: any[] = []; // Stores NRC Format Data
  selectedNrcPrefix = ''; // Selected NRC Prefix
  frontNrcFile: File | null = null;
  backNrcFile: File | null = null;


  constructor(
    private fb: FormBuilder,
    private cifService: CifService,
    private branchService: BranchService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cifForm = this.fb.group({
      name: ['', Validators.required],
      nrcNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      incomeSource: ['', Validators.required],
      branchId: ['', Validators.required],
    });


    this.branchService.getBranches().subscribe({
      next: (data) => (this.branches = data),
      error: (err) => console.error('Error loading branches:', err),
    });

    // ✅ Load NRC formats from JSON file
    this.http.get<any>('assets/nrc.json').subscribe({
      next: (data) => { this.nrcFormats = data.data; },
      error: (err) => { console.error('Error loading NRC formats:', err); }
    });
  }

  // ✅ Handle NRC Prefix Change
  onNrcPrefixChange(event: any) {
    this.selectedNrcPrefix = event.target.value;
  }


  // ✅ Validate Form
  isFormValid(): boolean {
    return this.cifForm.valid && this.nrcFormats.length > 0 && this.branches.length > 0;
  }


  onSubmit() {
    if (this.cifForm.invalid) {
      alert('Please fill in all required fields!');
      return;
    }

    const fullNrc = this.selectedNrcPrefix + "/" + this.cifForm.value.nrcNumber;

    const formData = new FormData();
    formData.append('name', this.cifForm.value.name);
    formData.append('nrcNumber', fullNrc);
    formData.append('dob', this.cifForm.value.dob);
    formData.append('gender', this.cifForm.value.gender);
    formData.append('phoneNumber', this.cifForm.value.phoneNumber);
    formData.append('email', this.cifForm.value.email);
    formData.append('address', this.cifForm.value.address);
    formData.append('maritalStatus', this.cifForm.value.maritalStatus);
    formData.append('occupation', this.cifForm.value.occupation);
    formData.append('incomeSource', this.cifForm.value.incomeSource);
    formData.append('branchId', this.cifForm.value.branchId);
    

    if (this.frontNrcFile) {
      formData.append('frontNrc', this.frontNrcFile);
    }
    if (this.backNrcFile) {
      formData.append('backNrc', this.backNrcFile);
    }


    this.cifService.createCIF(formData).subscribe({
      next: (response) => {
        console.log('CIF Created:', response);
        alert('CIF Created Successfully!');
        this.cifForm.reset();
      },
      error: (error) => {
        console.error('Error Creating CIF:', error);
        alert('Failed to create CIF');
      },
    });
  }  

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'front') {
        this.frontNrcFile = file;
      } else if (type === 'back') {
        this.backNrcFile = file;
      }
    }
  }
}
