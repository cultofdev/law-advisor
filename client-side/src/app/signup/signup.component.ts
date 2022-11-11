import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../shared/services/admin.service';
import { EmailValidator } from '../shared/util/email-validator';
import { PasswordValidator } from '../shared/util/password-validator';
import { UrlEndpoint } from '../shared/util/url-endpoint';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public signupForm!: FormGroup;

  public isVisible = false;
  public errorMessage!: string;

  public formValidationMessages = {
    username: [
      { type: 'pattern', message: 'Please enter a valid email' },
      { type: 'exists', message: 'This email is already in use' }
    ],
    password:[
      { type: 'minlength', message: 'Password must be at least 10 characters long!' },
      { type: 'pattern', message: 'Password must contain at least one letter and one number!' }
    ],
    confirmPassword:[
      { type: 'MatchPassword', message: 'Your password does not match!' }
    ],
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ], EmailValidator.emailValidator(this.adminService)],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(10)
      ])],
      confirmPassword: ['']
    }, {
      validator: PasswordValidator.MatchPassword,
    });
  }

  onSubmit(user: any) {
    const data = {
      username: user.username,
      password: user.password
    };

    this.adminService.post(UrlEndpoint.ADMIN.POST, data).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      complete: () => {
        this.isVisible = true;
      },
      error: () => {
        this.showError();

        setTimeout(() => {
          this.messageService.clear();
        }, 2000);
      }
    })
  }

  redirect(type: string) {
    this.router.navigate([`/${type}`])
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'an error occurred while creating user.' });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
