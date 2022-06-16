/* eslint-disable react/no-unused-class-component-methods */
import { Component } from 'react';

class MovieService extends Component {
  constructor() {
    super();
    this.url = 'https://api.themoviedb.org/3';
    this.key = '4ff745d3aa79a9672ba71ecbbc8220c7';
    this.fetchLink = '';
  }

  async getResource(resource, query, page, sessionId, rate) {
    this.fetchLink = `${this.url}${resource}?api_key=${this.key}`;

    if (page) this.fetchLink = `${this.url}${resource}?api_key=${this.key}&page=${page}`;
    if (query && page) this.fetchLink = `${this.url}${resource}?api_key=${this.key}&query=${query}&page=${page}`;
    if (sessionId) this.fetchLink = `${this.url}${resource}?api_key=${this.key}&guest_session_id=${sessionId}`;

    this.request = null;
    if (rate)
      this.request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ value: rate }),
      };

    const res = await fetch(this.fetchLink, this.request);

    if (!res.ok) throw new Error(`Could not fetch ${this.url}, recieved ${res.status}`);

    const data = await res.json();
    return data;
  }

  getRatedMovies(sessionId, page) {
    return this.getResource(`/guest_session/${sessionId}/rated/movies`, null, page);
  }

  getMovieGenres() {
    return this.getResource('/genre/movie/list');
  }

  rateMovie(movieId, guestSessionId, rate) {
    return this.getResource(`/movie/${movieId}/rating`, null, null, guestSessionId, rate);
  }

  createGuestSession() {
    return this.getResource('/authentication/guest_session/new');
  }

  searchMovies(query, page) {
    return this.getResource('/search/movie', query, page);
  }
}

export default MovieService;
