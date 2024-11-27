import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ScannerService } from "./service/scanner.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZXingScannerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  scannedResult: string = '';
  private scannerSubscription: Subscription | undefined;

  constructor(private scannerService: ScannerService) {}

  ngOnInit(): void {
    // Request permission for the camera when the component is initialized
    this.requestCameraPermission();
  }

  ngOnDestroy(): void {
    // Unsubscribe from scanner service if any active subscriptions
    if (this.scannerSubscription) {
      this.scannerSubscription.unsubscribe();
    }
  }

  // Request camera permission and access the camera
  private requestCameraPermission(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          alert('No video input devices found.');
        } else {
          // Use the first available video device or choose the one you prefer
          navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[0].deviceId } })
            .then((stream) => {
              // Successfully got a stream (camera is accessible)
            })
            .catch((error) => {
              console.error('Error accessing the camera:', error);
              alert('Error accessing the camera. Please check your permissions.');
            });
        }
      })
      .catch((err) => {
        console.error('Error enumerating devices:', err);
      });
  }

  // Handle QR code scan result
  onCodeResult(result: string): void {
    this.scannedResult = result;

    // Call the service to scan QR code
    this.scannerSubscription = this.scannerService.scanQRCode(result).subscribe({
      next: (response) => {
        alert('QR Code scanned successfully!');
        console.log('Scan Response:', response);
      },
      error: (err) => {
        console.error('Error scanning QR code:', err);
        alert('Error scanning QR code. Please try again.');
      },
    });
  }
}
