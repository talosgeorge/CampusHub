import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserDetails, UserDetailsService } from './services/user-details.service';


@Component({
  standalone: true,
  selector: 'app-user-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  clearHandicap() {
    this.detailsForm.get('handicap')?.setValue('');
  }
  
  detailsForm: FormGroup;
  isLoading = false;
  usersDetailsService = inject(UserDetailsService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.detailsForm = this.fb.group({
      cnp: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      nrMatricol: ['', Validators.required],
      facultate: ['', Validators.required],
      dataNasterii: ['', [Validators.required, this.dateNotInFutureValidator]],
      nume: ['', Validators.required],
      prenume: ['', Validators.required],
      prenumeTata: [''],
      prenumeMama: [''],
      sex: ['', Validators.required],
      judetulNasterii: ['', Validators.required],
      localitateaNasterii: ['', Validators.required],
      nationalitate: ['', Validators.required],
      seriaBuletin: ['', Validators.required],
      numarBuletin: ['', Validators.required],
      adresa: ['', Validators.required],
      handicap: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.isLoading = true;
    this.usersDetailsService.getMyDetails().subscribe({
      next: (data: { dataNasterii: string; }) => {
        const formattedData = {
          ...data,
          dataNasterii: this.convertToInputDate(data.dataNasterii)
        };
        this.detailsForm.patchValue(formattedData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading details', err);
        this.isLoading = false;
        this.showError('Eroare la încărcarea detaliilor');
      }
    });
  }

  onSubmit(): void {
    if (!this.detailsForm.valid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.showError('User ID invalid sau token expirat.');
      this.isLoading = false;
      return;
    }

    const formData: UserDetails = {
      ...this.detailsForm.value,
      dataNasterii: new Date(this.detailsForm.value.dataNasterii).toISOString(),
      userId
    };

    this.usersDetailsService.saveDetails(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.error('Save error:', err);
        this.isLoading = false;
        this.snackBar.open(
          `Error: ${err.error?.Message || err.message}`,
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  deleteDetails(): void {
    const confirmDelete = confirm("Are you sure you want to delete all your personal data");

    if (!confirmDelete) return;

    this.usersDetailsService.deleteMyDetails().subscribe({
      next: () => {
        this.snackBar.open("Data has been deleted", "Close", { duration: 3000 });
        this.detailsForm.reset();
      },
      error: err => {
        console.error("Eroare la ștergere", err);
        this.snackBar.open("Deleting Error", "Close", { duration: 5000 });
      }
    });
  }

  private convertToInputDate(backendDate: string): string {
    if (!backendDate) return '';
    return backendDate.split('T')[0];
  }

  private dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    if (inputDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Închide', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.detailsForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch (error) {
      console.error('Eroare la decodificarea tokenului:', error);
      return null;
    }
  }
}
