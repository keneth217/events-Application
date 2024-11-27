import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private baseUrl = 'http://localhost:8080/api/v1/admin/scan';

  constructor(private http: HttpClient) {}

  // API call to scan QR code
  scanQRCode(qrCodeContent: string): Observable<any> {
    return this.http.post(this.baseUrl, { qrCodeContent });
  }
}
