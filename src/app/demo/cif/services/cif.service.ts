import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CIF {
  id: number;
  name: string;
  nrcNumber: string;
  dob: string; // Use string because JSON from API returns it as text
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  maritalStatus: string;
  occupation: string;
  incomeSource: string;
  createdAt: string;
  branchId: number;
  hasCurrentAccount: boolean;
  fNrcPhotoUrl: string; // Cloudinary Front NRC Image
  bNrcPhotoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CifService {
  private baseUrl = 'http://localhost:8080/api/cifs'; 

  constructor(private http: HttpClient) {}

  getAllCIFs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  updateCIF(cif: CIF) {
    return this.http.put(`${this.baseUrl}/${cif.id}`, cif);
  }


  // Delete CIF
  deleteCIF(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCIFById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }


  createCIF(cifData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, cifData);
  }

  
}
