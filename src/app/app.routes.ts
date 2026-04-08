import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'dashboard',
    // Esto es para cargar el componente de forma perezosa (lazy loading)
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page'),
    children: [
        {
          path: 'search',
          loadComponent: () => import('./gifs/pages/search-page/search-page'),
        },
        {
          path: 'history/:query',
          loadComponent: () => import('./gifs/pages/gif-history/gif-history'),
        },
        {
          path: 'trending',
          loadComponent: () => import('./gifs/pages/trending-page/trending-page'),
        },
        {
          path: '**',
          redirectTo: 'trending',

        }
    ]
  },


  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
