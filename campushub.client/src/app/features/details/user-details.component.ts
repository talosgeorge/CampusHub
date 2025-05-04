import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  detailsForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.detailsForm = this.fb.group({
      cnp: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      nrMatricol: ['', Validators.required],
      facultate: ['', Validators.required],
      dataNasterii: ['', Validators.required],
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
      adresa: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.isLoading = true;
    this.http.get('/api/userdetails/my').subscribe({
      next: (data: any) => {
        this.detailsForm.patchValue(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading details', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.detailsForm.valid) {
      this.isLoading = true;
      this.http.post('/api/userdetails', this.detailsForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error saving details', err);
          this.isLoading = false;
        }
      });
    }
  }
}
