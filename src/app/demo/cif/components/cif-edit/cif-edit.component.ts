import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CifService } from '../../services/cif.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CIF } from '../cif-list/cif-list.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-cif-edit',
  imports: [ReactiveFormsModule, MatFormField, MatLabel],
  templateUrl: './cif-edit.component.html',
  styleUrl: './cif-edit.component.scss'
})
export class CifEditComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CifEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CIF,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      nrcNumber: [data.nrcNumber, Validators.required],
      dob: [data.dob, Validators.required],
      phoneNumber: [data.phoneNumber, Validators.required],
      email: [data.email, [Validators.required, Validators.email]]
    });
  }

  save() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value); // Send data back to parent
    }
  }
  

  close() {
    this.dialogRef.close();
  }
}
