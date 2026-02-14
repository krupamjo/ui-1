import {environment} from '../environments/environment';
import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ui-1');
  private http = inject(HttpClient);
  ngOnInit() {
    {
      this.http.get(`${environment.apiUrl}/weatherforecast`).subscribe(values => {
        console.log(values);
      });
    }
  }
}
