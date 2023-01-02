import { HttpClient } from '@angular/common/http';
import { Signup } from './../_helpers/signup.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './must.match.validation';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  //variables decalar
  apiUrl = 'http://localhost:3000/signupusers';
  signupForm!: FormGroup;
  submitted: boolean = false;
  isUser: boolean = false;
  uniqUsers!: Signup[];

  constructor(
    private _fb: FormBuilder,
    private alert: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this._fb.group(
      {
        name: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        cpassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'cpassword'),
      }
    );
  }
  // form use in validation purpose
  get f() {
    return this.signupForm.controls;
  }
  // signup user method

  onSignupUser() {

    this.submitted = true;
    if (this.signupForm.valid) {
      this.http
        .post<Signup>(this.apiUrl, this.signupForm.value)
        .subscribe((res) => {
          this.alert.success('Successfully User is Register', 'Users Register');
          this.router.navigate(['/login']);
        });
    }else{
      this.alert.warning('Please enter values in all mandatory filed', 'Validation');
    }
  }
}
