import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {



  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListenenr = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  public getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListenenr.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(username: string, email: string, password: string) {
    const authData: AuthData = { username, email, password };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/login']);
      }, err => {
        this.authStatusListenenr.next(false);
      });
  }


  loginUser(email: string, password: string) {
    const authData: AuthData = { username: '', email, password };
    this.http.post<{ userId: string }>('http://localhost:3000/api/user/login', authData)
      // token: string, expiresIn: number,
      .subscribe(response => {   this.router.navigate(['/']);},
        // .subscribe(response => {
        //     console.log(response);
        //     const token = response.token;
        //     this.token = token;
        //     if (token) {
        //       const expiresInDuration = response.expiresIn;
        //       this.setAuthTimer(expiresInDuration);
        //       this.isAuthenticated = true;
        //       this.userId = response.userId;
        //       this.authStatusListenenr.next(true);
        //       const now = new Date();
        //       const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        //       this.saveAuthData(token, expirationDate, this.userId);
        //       this.router.navigate(['/']);
        //     }

        //   },
        err => {
        this.authStatusListenenr.next(false);
  });

}


  private setAuthTimer(duration: number) {
  console.log('Setting Timer : ' + duration);
  this.tokenTimer = setTimeout(() => {
    this.logoutUser();
  }, duration * 1000);
}

autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListenenr.next(true);
  }

}

logoutUser() {
  this.token = null;
  this.isAuthenticated = false;
  this.authStatusListenenr.next(false);
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.userId = null;
  this.router.navigate(['/']);
}

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expirationDate.toString());
  localStorage.setItem('userId', userId);
}

  private getAuthData() {
  const token = localStorage.getItem('token');
  const expirationDate = localStorage.getItem('expiration');
  const userId = localStorage.getItem('userId');
  if (!token || !expirationDate) {
    return;
  }
  return {
    token,
    expirationDate: new Date(expirationDate),
    userId
  };
}

  private clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
  localStorage.removeItem('userId');
}
}
