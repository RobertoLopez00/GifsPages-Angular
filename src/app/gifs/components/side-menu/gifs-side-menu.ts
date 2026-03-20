import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GifsSideMenuOptions } from "./side-menu-options/gifs-side-menu-options";
import { GifsSideMenuHeader } from "./side-menu-header/gifs-side-menu-header";

@Component({
  selector: 'app-gifs-side-menu',
  imports: [GifsSideMenuOptions, GifsSideMenuHeader],
  templateUrl: './gifs-side-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsSideMenu { }
