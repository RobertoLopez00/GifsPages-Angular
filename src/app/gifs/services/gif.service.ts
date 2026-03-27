import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import TrendingPage from '../pages/trending-page/trending-page';

@Injectable({
  providedIn: 'root'
})

export class GifService {

  private http = inject(HttpClient);

  constructor() {
    this.loadTrendingGifs();
  }

  trendingGifs = signal<Gif[]>([])

  TrendingGifsLoading = signal(true);

 loadTrendingGifs() {

  return this.http.get<GiphyResponse>(`${environment.giphyUrl}/trending`, {
    params: {
      api_key: environment.giphyApiKey,
      limit: '20',
      rating: 'g',
    },
  }).subscribe((response) => {
    const gifs = GifMapper.mapHiphyItemsToGifArray(response.data);
    this.trendingGifs.set(gifs);
    console.log(gifs);
  });
 }

}
