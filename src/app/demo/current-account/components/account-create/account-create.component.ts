import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CurrentAccountService } from '../../services/current-account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.scss'
})
export class AccountCreateComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
  currentAccountForm!: FormGroup;

  constructor(private fb: FormBuilder, private accountService: CurrentAccountService) {}

  ngOnInit(): void {
    this.currentAccountForm = this.fb.group({
      accountNumber: [{ value: '', disabled: true }],
      balance: [0, [Validators.required]],
      status: [1, [Validators.required]],
      dateCreated: [new Date().toISOString().slice(0, 16), [Validators.required]],
      holdAmount: [0],
      cifId: [1, [Validators.required]]
    });
  }

  createAccount(): void {
    if (this.currentAccountForm.valid) {
      const formData = {
        balance: this.currentAccountForm.value.balance,
        status: this.currentAccountForm.value.status,
        dateCreated: this.currentAccountForm.value.dateCreated,
        holdAmount: this.currentAccountForm.value.holdAmount,
        cif: { id: this.currentAccountForm.value.cifId }
      };

      this.accountService.createAccount(formData).subscribe({
        next: (response: any) => console.log('Account created', response),
        error: (err) => console.error('Error creating account', err)
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
