import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { UrlEndpoint } from '../shared/util/url-endpoint';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  onSubmit(user: any) {
    this.authService.post(UrlEndpoint.AUTH.SIGNIN, user).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (result) => {
        if(result) {
          this.router.navigate(['/todo']);
        }
      },
      error: (err) => {
        this.showError(err.error.message);

        setTimeout(() => {
          this.messageService.clear();
        }, 2000);
      }
    });
  }

  redirect(type: string) {
    this.router.navigate([`/${type}`])
  }

  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: error });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
