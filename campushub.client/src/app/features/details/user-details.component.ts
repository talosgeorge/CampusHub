import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  detailsForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.detailsForm = this.fb.group({
      cnp: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      nrMatricol: ['', Validators.required],
      facultate: ['', Validators.required],
      dataNasterii: ['', [Validators.required,this.dateNotInFutureValidator]],
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
    this.http.get('https://localhost:7284/api/userdetails/my').subscribe({
      next: (data: any) => {
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
    console.log('Form submitted', this.detailsForm.value);
    console.log('Form valid:', this.detailsForm.valid);

    if (this.detailsForm.valid) {
      this.isLoading = true;

      const userId = this.getUserIdFromToken();
      if (!userId) {
        this.showError('User ID invalid sau token expirat.');
        this.isLoading = false;
        return;
      }

      const formData = {
        ...this.detailsForm.value,
        dataNasterii: new Date(this.detailsForm.value.dataNasterii).toISOString(),
        userId: userId
      };

      console.log('Data being sent:', formData);

      this.http.post('https://localhost:7284/api/userdetails', formData).subscribe({
        next: (response) => {
          console.log('Save successful', response);
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
    } else {
      console.log('Form invalid, errors:', this.detailsForm.errors);
      this.markAllAsTouched();
    }
  }

  private convertToInputDate(backendDate: string): string {
    if (!backendDate) return '';
    return backendDate.split('T')[0];
  }
  clearHandicap(): void {
    this.detailsForm.get('handicap')?.setValue('');
  }
  private dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    if (inputDate > today) {
      return { futureDate: true };
    }
    return null;
  }
  deleteDetails(): void {
    const confirmDelete = confirm("Are you sure you want to delete all your personal data");

    if (!confirmDelete) return;

    this.http.delete('https://localhost:7284/api/userdetails/my').subscribe({
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
