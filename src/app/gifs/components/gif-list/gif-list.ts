import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GifListItem } from "./gif-list-item/gif-list-item";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-gif-list',
  imports: [GifListItem],
  templateUrl: './gif-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifList {
  gifs = input.required<Gif[]>();
}
