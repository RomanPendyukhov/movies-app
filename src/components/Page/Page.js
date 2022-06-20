import { Component } from 'react';
import { Col, Alert, Pagination } from 'antd';

import MovieService from '../../services/MovieService';
import MovieCard from '../MovieCard';
import MovieSearch from '../MovieSearch';
import ErrorAlert from '../ErrorAlert';
import Spinner from '../Spinner';

export default class Page extends Component {
  movie = new MovieService();

  constructor() {
    super();
    this.state = {
      movies: [],
      total: 0,
      searchQuery: 'return',
      currentPage: 1,
      sessionId: null,
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
    const { page } = this.props;
    if (page === 'Search') this.searchMovies();
    if (page === 'Rated') this.getRated();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;
    const { page, currentTab } = this.props;
    if (prevState.searchQuery !== searchQuery) {
      this.searchMovies();
    }
    if (prevState.currentPage !== currentPage && page === 'Search') {
      this.searchMovies();
    }
    if (prevState.currentPage !== currentPage && page === 'Rated') {
      this.getRated();
    }
    if (prevProps.currentTab !== currentTab && page === 'Rated') {
      this.setState({ loading: true });
      this.getRated();
    }
  }

  getRated() {
    const { sessionId, currentPage } = this.state;
    const { sessionId: id } = this.props;
    const guestSession = !sessionId ? id : sessionId;
    this.movie.getRatedMovies(guestSession, currentPage).then(this.setSearchedMovies).catch(this.onError);
  }

  setSearchedMovies = ({ results, total_results: total }) => {
    this.setState({
      movies: results,
      loading: false,
      total,
    });
  };

  setQuery = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      loading: true,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  setPage = (currentPage) => {
    this.setState({ currentPage, loading: true });
  };

  changeRate = (id, rate) => {
    const { sessionId } = this.state;
    const { sessionId: sId } = this.props;
    const guestSession = !sessionId ? sId : sessionId;
    this.movie.rateMovie(id, guestSession, rate);
    localStorage.setItem(id, rate);
  };

  createCards = (movies, message) => {
    if (!movies.length) return <Alert message={message} type="info" />;
    return movies.map((movie) => (
      <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
        <MovieCard
          movieId={movie.id}
          title={movie.original_title}
          overview={movie.overview}
          rating={movie.vote_average}
          date={movie.release_date}
          poster={movie.poster_path}
          genreId={movie.genre_ids}
          changeRate={this.changeRate}
        />
      </Col>
    ));
  };

  searchMovies() {
    const { searchQuery, currentPage } = this.state;
    this.movie.searchMovies(searchQuery, currentPage).then(this.setSearchedMovies).catch(this.onError);
  }

  render() {
    const { movies, loading, error, currentPage, total } = this.state;
    const { page } = this.props;
    const message = page === 'Search' ? 'Cannot find movies. Try another title' : 'There are no rated movies!';
    const movieCards = this.createCards(movies, message);
    const content = !(loading || error) ? movieCards : null;

    return (
      <>
        {page === 'Search' ? <MovieSearch onChangeQuery={this.setQuery} /> : null}
        <ErrorAlert error={error} />
        <Spinner isLoading={loading} />
        {content}
        {!error && !loading && (
          <Col span={24} style={{ textAlign: 'center', marginTop: '25px' }}>
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              pageSize={20}
              showSizeChanger={false}
              onChange={this.setPage}
            />
          </Col>
        )}
      </>
    );
  }
}
