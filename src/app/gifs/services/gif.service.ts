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
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    console.log(groups);
    return groups;

  });

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));



 loadTrendingGifs() {

  if(this.trendingGifsLoading()) return;

  this.trendingGifsLoading.set(true);

   this.http.get<GiphyResponse>(`${environment.giphyUrl}/trending`, {
    params: {
      api_key: environment.giphyApiKey,
      limit: '20',
      rating: 'g',
      offset: this.trendingPage() * 20,
    },
  }).subscribe((response) => {
    const gifs = GifMapper.mapHiphyItemsToGifArray(response.data);
    this.trendingGifs.update(currentGifs => [
      ... currentGifs,
      ... gifs
    ]);
    this.trendingPage.update(currentPage => currentPage + 1);
    this.trendingGifsLoading.set(false);
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
