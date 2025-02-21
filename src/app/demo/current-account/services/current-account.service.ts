import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentAccountService {
  private apiUrl = 'http://localhost:8080/api/current-accounts';

  constructor(private http: HttpClient) {}

  createAccount(account: any): Observable<any> {
    return this.http.post(this.apiUrl, account);
  }
}
