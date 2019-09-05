import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }


  OnLogin(form: NgForm) {
    this.authService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
