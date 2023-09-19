import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authApi } from './slices/authSlices';
import { homeScreenApi } from './slices/HomeScreenSlices'; // Ekleyin

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [homeScreenApi.reducerPath]: homeScreenApi.reducer, // Bu satırı ekleyin
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(homeScreenApi.middleware), // Bu satırı ekleyin
});

setupListeners(store.dispatch);
