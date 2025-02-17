import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-branch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-create.component.html',
  styleUrl: './branch-create.component.scss'
})
export class BranchCreateComponent {
  branchForm!: FormGroup;
  regions: string[] = [];
  districts: string[] = [];
  townships: string[] = [];
  locationData: any = {}; // Store the JSON data

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      region: ['', Validators.required],
      district: ['', Validators.required],
      township: ['', Validators.required],
      branchName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required]
    });

    // ✅ Load JSON file
    this.http.get<any>('assets/myanmar-townships.json').subscribe(data => {
      this.locationData = data;
      this.regions = Object.keys(data); // ✅ Extract regions
    });
  }

  // ✅ Update Districts when Region is selected
  onRegionChange() {
    const selectedRegion = this.branchForm.value.region;
    this.districts = selectedRegion ? Object.keys(this.locationData[selectedRegion]) : [];
    this.townships = []; // Reset townships
    this.branchForm.patchValue({ district: '', township: '' }); // Reset selections
  }

  // ✅ Update Townships when District is selected
  onDistrictChange() {
    const selectedRegion = this.branchForm.value.region;
    const selectedDistrict = this.branchForm.value.district;
    this.townships = selectedRegion && selectedDistrict ? this.locationData[selectedRegion][selectedDistrict] : [];
    this.branchForm.patchValue({ township: '' }); // Reset township selection
  }

  // ✅ Submit Form
  onSubmit() {
    if (this.branchForm.valid) {
      console.log('Branch Data:', this.branchForm.value);
      // Add API call here
    }
  }
}