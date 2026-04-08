import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import TrendingPage from '../pages/trending-page/trending-page';
import { map, tap } from 'rxjs';

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

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

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

 searchGifs(query: string) {

  return this.http.get<GiphyResponse>(`${environment.giphyUrl}/search`, {
    params: {
      api_key: environment.giphyApiKey,
      q: query,
      limit: '20',
      rating: 'g',
    },
  }).pipe(
    map(({data}) => data),
    map((items) => GifMapper.mapHiphyItemsToGifArray(items)),

    //TODO
    tap((gifs) => {
      const currentHistory = this.searchHistory();
      this.searchHistory.set({
        ...currentHistory,
        [query]: gifs,
      });
    })
  );
  // .subscribe((response) => {
  //   const gifs = GifMapper.mapHiphyItemsToGifArray(response.data);
  //   console.log(gifs);
  // });
 }

}
