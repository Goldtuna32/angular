import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private baseUrl = 'http://localhost:8080/api/branches'; // Adjust as needed

  constructor(private http: HttpClient) { }

  // Get all branches
  getBranches(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Create a new branch
  createBranch(branchData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, branchData);
  }
}
