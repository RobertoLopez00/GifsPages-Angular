import { Component, signal } from '@angular/core';
import DashboardPage from "./gifs/pages/dashboard-page/dashboard-page";


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [DashboardPage]
})

export class App {
  protected readonly title = signal('gifs-app');
}
