import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  /**Angular Reactive Form instance for login form */
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {}
  /**Login user and show success or error toast */
  login() {
    this.authService.login(this.loginForm.value).subscribe(
      result => {
        console.log(result);
        this.toastCtrl.create({message: 'Login Successful', color: 'success', duration: 500}).then(toast => toast.present());
        this.router.navigateByUrl('/menu');
        this.loginForm.reset();
      },
      error => {
        this.toastCtrl.create({
          color: 'danger',
          message: error.error.title,
          duration: 2000
        }).then(toast => toast.present());
      },
    );
  }

}
