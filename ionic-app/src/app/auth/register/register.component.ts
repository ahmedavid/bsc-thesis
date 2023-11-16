import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    location: new FormControl(''),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService,private toastCtrl: ToastController) { }

  ngOnInit() {}
  /**Register user and show appropriate result */
  register() {
    if (this.registerForm.valid) {
      this.authService.register({...this.registerForm.value, specialityId: 1, isBookee: false}).subscribe(
        result => {
          this.registerForm.reset();
          this.toastCtrl.create({message: 'Register Successful,Please log in!', color: 'success', duration: 2000}).then(toast => toast.present());
        },
        error => this.toastCtrl.create({message: 'Register Failed!', color: 'danger', duration: 2000}).then(toast => toast.present())
      );
    }
  }

}
