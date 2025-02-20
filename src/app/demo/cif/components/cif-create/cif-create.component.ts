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

  // ✅ Cloudinary Details (Replace with your credentials)
  cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ded6wfpaz/image/upload';
  uploadPreset = 'NRC_Upload';  // Unsigned Upload Preset

  constructor(
    private fb: FormBuilder,
    private cifService: CifService,
    private branchService: BranchService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // ✅ Initialize Form
    this.cifForm = this.fb.group({
      name: ['', Validators.required],
      nrcPrefix: ['', Validators.required], // NRC Prefix from JSON
      nrcNumber: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6 Digits NRC Number
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      incomeSource: ['', Validators.required],
      branchId: ['', Validators.required], // Store Branch ID
      fNrcPhotoUrl: [''],
      bNrcPhotoUrl: ['']
    });

    // ✅ Load branches from backend
    this.branchService.getBranches().subscribe({
      next: (data) => { this.branches = data; },
      error: (err) => { console.error('Error loading branches:', err); }
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

  async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);  
  
    try {
      const response = await this.http.post<any>(this.cloudinaryUrl, formData).toPromise();
      return response.secure_url || '';  // Ensure it returns a valid URL or empty string
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      return '';
    }
  }
  

  // ✅ Validate Form
  isFormValid(): boolean {
    return this.cifForm.valid && this.nrcFormats.length > 0 && this.branches.length > 0;
  }

  

  async onSubmit() {
    if (this.cifForm.invalid) {
      alert("Please fill in all required fields correctly!");
      return;
    }
  
    try {
      // ✅ Upload Front NRC (if selected)
      if (this.frontNrcFile) {
        const fNrcPhotoUrl = await this.uploadToCloudinary(this.frontNrcFile);
        this.cifForm.patchValue({ fNrcPhotoUrl });
      }
  
      // ✅ Upload Back NRC (if selected)
      if (this.backNrcFile) {
        const bNrcPhotoUrl = await this.uploadToCloudinary(this.backNrcFile);
        this.cifForm.patchValue({ bNrcPhotoUrl });
      }
  
      // ✅ Prepare Form Data
      const formData = this.cifForm.value;
      console.log("Submitting Data to Backend:", formData); // ✅ Debugging log
  
      
      this.cifService.createCIF(formData).subscribe({
        next: (response) => {
          console.log("CIF Created:", response);
          alert("CIF Created Successfully!");
          this.cifForm.reset();
        },
        error: (error) => {
          console.error("Error Creating CIF:", error);
          alert("Failed to create CIF");
        }
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  }
  
  

  // ✅ File selection
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
