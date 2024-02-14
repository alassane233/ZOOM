import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  payload = {
    authEndpoint : 'http://localhost:4000',
    sdkKey: '_IU8ZAMRSgKaeb1FzUacsw',
    meetingNumber : '78780624941',
    passWord: 'bA53Z2',
    role : 0,
    iat: 1707735516,
    exp: 1707742716,
    userName : 'Angular',
    userEmail : '',
    registrantToken : '',
    zakToken : 'http://localhost:62227'

  }

  client = ZoomMtgEmbedded.createClient();

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document, private ngZone: NgZone) {
  }
  // tslint:disable-next-line:typedef
  ngOnInit() {

  }
  getSignature(): void {
    this.httpClient.post(this.payload.authEndpoint, {
      meetingNumber: this.payload.meetingNumber,
      role: this.payload.role
    }).subscribe({ next: (data: any) => {
      if (data.signature) {
        console.log(data.signature)
        const sign = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJfSVU4WkFNUlNnS2FlYjFGelVhY3N3IiwiaWF0IjoxNzA3NzM1ODgwLCJleHAiOjE3MDc3NDMwODAsImFwcEtleSI6Il9JVThaQU1SU2dLYWViMUZ6VWFjc3ciLCJ0b2tlbkV4cCI6MTcwNzc0MzA4MH0.zl4cvA3-SrdgKT1dfPe6Y47kq95YibTMEo1s4HjVZr8'
        this.startMeeting(sign)
      } else {
        console.log(data)
      }
    }, error : err => {
    console.log(err)
    }
      }
    )
  }
  startMeeting(signature): void {
    const meetingSDKElement = document.getElementById('meetingSDKElement');
    this.ngZone.runOutsideAngular(() => {
      this.client.init({zoomAppRoot: meetingSDKElement, language: 'en-US', patchJsMedia: true}).then(() => {
        this.client.join({
          signature: signature,
          sdkKey: this.payload.sdkKey,
          meetingNumber: this.payload.meetingNumber,
          password: this.payload.passWord,
          userName: this.payload.userName,
          userEmail: this.payload.userEmail,
          tk: this.payload.registrantToken,
          zak: this.payload.zakToken
        }).then(() => {
          console.log('joined successfully')
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => {
        console.log(error)
      })
    })
  }
}
