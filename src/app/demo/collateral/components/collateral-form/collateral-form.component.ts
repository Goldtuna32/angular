import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CollateralService } from '../../services/collateral.service';
import { Router } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-collateral-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
  templateUrl: './collateral-form.component.html',
  styleUrl: './collateral-form.component.scss'
})
export class CollateralFormComponent implements OnInit {
  // Add these new properties
  showDropdown = false;
  searchInput = '';
  frontPhotoPreview: string | null = null;
  backPhotoPreview: string | null = null;

  collateralForm!: FormGroup;
  cifs: any[] = [];
  filteredCifs: any[] = [];  // For filtered results
  searchTerm: string = '';   // For search input
  today: string = new Date().toISOString().split('T')[0];
  constructor(
    private fb: FormBuilder,
    private collateralService: CollateralService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.loadCifs();
  }
  private initForm(): void {
    this.collateralForm = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: [1, Validators.required],
      cifId: ['', Validators.required],
      collateralTypeId: [1],
      F_collateralPhoto: [null, Validators.required],
      B_collateralPhoto: [null, Validators.required],
      collateralCode: ['AUTO', Validators.required]
    });
  }
  // Remove all other onSubmit methods and keep only this one
  onSubmit(): void {
    if (this.collateralForm.valid) {
      const formData = new FormData();
      
      // Append all required fields to FormData
      formData.append('value', this.collateralForm.get('value')?.value);
      formData.append('description', this.collateralForm.get('description')?.value);
      formData.append('status', this.collateralForm.get('status')?.value);
      formData.append('cifId', this.collateralForm.get('cifId')?.value);
      formData.append('collateralTypeId', this.collateralForm.get('collateralTypeId')?.value);
      
      // Append photo files
      const frontPhoto = this.collateralForm.get('F_collateralPhoto')?.value;
      const backPhoto = this.collateralForm.get('B_collateralPhoto')?.value;
      
      if (frontPhoto) {
        formData.append('F_collateralPhoto', frontPhoto);
      }
      
      if (backPhoto) {
        formData.append('B_collateralPhoto', backPhoto);
      }

      this.collateralService.createCollateral(formData).subscribe({
        next: (response) => {
          console.log('Collateral created successfully:', response);
          this.router.navigate(['/collateral']);
        },
        error: (error) => {
          console.error('Error creating collateral:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  private loadCifs(): void {
    this.collateralService.getAllCifs().subscribe({
      next: (data) => {
        this.cifs = data;
        this.filteredCifs = data;
      },
      error: (error) => {
        console.error('Error loading CIFs:', error);
      }
    });
  }
  filterCifs(event: any): void {
    this.searchInput = event.target.value;
    if (!this.searchInput) {
      this.filteredCifs = [];
      this.showDropdown = false;
      return;
    }

    const search = this.searchInput.toLowerCase();
    this.filteredCifs = this.cifs.filter(cif =>
      cif.name.toLowerCase().includes(search) ||
      cif.nrcNumber.toLowerCase().includes(search)
    ).slice(0, 10);
    this.showDropdown = true;
  }
  selectCif(cif: any): void {
    this.searchInput = `${cif.name} - ${cif.nrcNumber}`;
    this.collateralForm.patchValue({ cifId: cif.id });
    this.showDropdown = false;
  }
  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  selectedCif: any = null;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.cifs.filter(cif =>
          cif.name.toLowerCase().includes(term.toLowerCase()) ||
          cif.nrcNumber.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10))
    )
  formatter = (cif: any) => `${cif.name} - ${cif.nrcNumber}`;
  onSelect(event: any): void {
    this.selectedCif = event.item;
    this.collateralForm.patchValue({
      cifId: event.item.id
    });
  }
  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.filteredCifs = this.cifs.slice(0, 10); // Show first 10 items
    }
  }
  onFrontPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({
        F_collateralPhoto: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.frontPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({
        B_collateralPhoto: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.backPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
