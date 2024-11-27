import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  scannedResult: string = '';

  constructor(private http: HttpClient) {}

  onCodeResult(result: string): void {
    this.scannedResult = result;

    // Make an API call to your backend method
    this.http.post('/api/v1/scan', { qrCodeContent: result }).subscribe({
      next: (response) => {
        alert('QR Code scanned successfully!');
        console.log(response);
      },
      error: (err) => {
        console.error('Error scanning QR code:', err);
        alert('Error scanning QR code. Please try again.');
      }
    });
  }
}
