import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GifsSideMenu } from "../../components/side-menu/gifs-side-menu";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, GifsSideMenu],
  templateUrl: './dashboard-page.html',
  standalone: true
})
export default class DashboardPage { }
