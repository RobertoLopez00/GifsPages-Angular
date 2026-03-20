import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifListItem {

  imageUrl = input.required<string>();
}
