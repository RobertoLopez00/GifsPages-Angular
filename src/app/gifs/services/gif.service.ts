import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GifService {

  private readonly searchHistoryStorageKey = 'searchHistory';

  private http = inject(HttpClient);

  constructor() {
    this.loadSearchHistoryFromLocalStorage();
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

 searchGifs(query: string): Observable<Gif[]> {

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: normalizedQuery,
        limit: '20',
        rating: 'g',
      },
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapHiphyItemsToGifArray(items))
    );
  }

  return this.http.get<GiphyResponse>(`${environment.giphyUrl}/search`, {
    params: {
      api_key: environment.giphyApiKey,
      q: normalizedQuery,
      limit: '20',
      rating: 'g',
    },
  }).pipe(
    map(({data}) => data),
    map((items) => GifMapper.mapHiphyItemsToGifArray(items)),

    //TODO
    tap((gifs) => {
      const currentHistory = this.searchHistory();

      // Keep latest search first and avoid duplicate keys with different order.
      const { [normalizedQuery]: _, ...restHistory } = currentHistory;

      this.searchHistory.set({
        [normalizedQuery]: gifs,
        ...restHistory,
      });

      localStorage.setItem(this.searchHistoryStorageKey, JSON.stringify(this.searchHistory()));
    })
  );
  // .subscribe((response) => {
  //   const gifs = GifMapper.mapHiphyItemsToGifArray(response.data);
  //   console.log(gifs);
  // });
 }

 getHistoryGifs(query: string): Gif[] {
  const history = this.searchHistory();
  return history[query] ?? [];
 }

 private loadSearchHistoryFromLocalStorage(): void {
  const storedHistory = localStorage.getItem(this.searchHistoryStorageKey);

  if (!storedHistory) {
    return;
  }

  try {
    const parsedHistory: unknown = JSON.parse(storedHistory);

    if (parsedHistory && typeof parsedHistory === 'object') {
      this.searchHistory.set(parsedHistory as Record<string, Gif[]>);
    }
  } catch {
    localStorage.removeItem(this.searchHistoryStorageKey);
  }
 }

}
