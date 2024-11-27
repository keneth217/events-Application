import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { CommonModule } from "@angular/common";

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
  isCameraAccessible: boolean = false;
  private scannerSubscription: Subscription | undefined;

  constructor(private scannerService: ScannerService) {}

  ngOnInit(): void {
    this.requestCameraPermission();
  }

  ngOnDestroy(): void {
    if (this.scannerSubscription) {
      this.scannerSubscription.unsubscribe();
    }
  }

  protected requestCameraPermission(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          this.isCameraAccessible = false;
          alert('No video input devices found.');
        } else {
          navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[0].deviceId } })
            .then((stream) => {
              this.isCameraAccessible = true; // Camera is accessible
            })
            .catch((error) => {
              console.error('Error accessing the camera:', error);
              alert('Error accessing the camera. Please check your permissions.');
            });
        }
      })
      .catch((err) => {
        console.error('Error enumerating devices:', err);
        this.isCameraAccessible = false;
      });
  }

  onCodeResult(result: string): void {
    this.scannedResult = result;
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
