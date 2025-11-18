# StreamBox - API Integration Guide

## Current Implementation

The app currently uses **mock data** with placeholder images for demonstration purposes.

## Integrating with The Movie Database API

### Step 1: Get API Key

1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Sign up for a free account
3. Generate an API key
4. Copy your API key

### Step 2: Update Constants

Edit `src/utils/constants.js`:

```javascript
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = 'your_actual_api_key_here';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
```

### Step 3: Update API Service

Edit `src/services/api.js` to use real endpoints:

```javascript
export const movieService = {
  getTrendingMovies: async () => {
    try {
      const response = await apiClient.get('/trending/movie/week', {
        params: {
          api_key: API_KEY,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch movies');
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const response = await apiClient.get(`/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          append_to_response: 'credits'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch movie details');
    }
  },

  searchMovies: async (query) => {
    try {
      const response = await apiClient.get('/search/movie', {
        params: {
          api_key: API_KEY,
          query: query,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search movies');
    }
  }
};
```

### Step 4: Update Image URLs

In components, use proper image URLs:

```javascript
<Image 
  source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
  style={styles.poster}
/>
```

## Using DummyJSON for Fallback

If TMDB API is unavailable, use DummyJSON:

```javascript
const getTrendingMovies = async () => {
  try {
    // Try TMDB first
    return await getTrendingMoviesFromTMDB();
  } catch (error) {
    // Fallback to DummyJSON
    return await getTrendingMoviesFromDummyJSON();
  }
};
```

## API Endpoints Reference

### Trending Movies
```
GET /trending/movie/week?api_key={API_KEY}&language=en-US
```

### Search Movies
```
GET /search/movie?api_key={API_KEY}&query={search_query}&language=en-US
```

### Movie Details
```
GET /movie/{movie_id}?api_key={API_KEY}&append_to_response=credits
```

### Movie Images
```
https://image.tmdb.org/t/p/{size}/{image_path}

Sizes: w92, w154, w185, w342, w500, w780, original
```

## Authentication API (Backend Required)

For production, implement your own backend:

```javascript
export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(
        'https://your-backend.com/auth/login',
        { email, password }
      );
      return response.data; // { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axios.post(
        'https://your-backend.com/auth/register',
        { username, email, password }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  }
};
```

## Rate Limiting

TMDB API has rate limits:
- Free tier: 40 requests per 10 seconds

Implement rate limiting:

```javascript
const createRateLimiter = () => {
  let lastCall = 0;
  const delay = 250; // 250ms between calls

  return async (fn) => {
    const now = Date.now();
    const waitTime = Math.max(0, delay - (now - lastCall));
    
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastCall = Date.now();
    return fn();
  };
};
```

## Error Handling

Implement proper error handling:

```javascript
try {
  const movies = await movieService.getTrendingMovies();
  dispatch(fetchMoviesSuccess(movies.results));
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - refresh token
    refreshAuthToken();
  } else if (error.response?.status === 429) {
    // Rate limited - retry with backoff
    retryWithBackoff();
  } else {
    dispatch(fetchMoviesFailure(error.message));
  }
}
```

## Caching Strategy

Implement response caching:

```javascript
const cache = new Map();

export const getCachedData = async (key, fetcher, ttl = 5 * 60 * 1000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

## Testing API Integration

Use mock data for testing:

```javascript
jest.mock('../services/api', () => ({
  movieService: {
    getTrendingMovies: jest.fn().mockResolvedValue({
      results: mockMovies
    })
  }
}));
```

---

**API Integration Complete! 🎬**
