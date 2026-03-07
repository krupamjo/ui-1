import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountMenuComponent } from '../account-menu/account-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccountMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ui-1');
}
