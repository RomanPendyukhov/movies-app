import { Component } from 'react';
import { Layout, Tabs, Row } from 'antd';

import './App.css';
import Page from '../Page';
import MovieService from '../services/MovieService';
import { Provider } from '../context';

const { TabPane } = Tabs;

class App extends Component {
  movie = new MovieService();

  pages = [{ page: 'Search' }, { page: 'Rated' }];

  constructor() {
    super();
    this.state = {
      currentTab: 'Search',
      sessionId: null,
      genres: null,
    };
  }

  componentDidMount() {
    this.movie.getMovieGenres().then(({ genres }) => this.setState({ genres }));
    this.movie.createGuestSession().then(({ guest_session_id: sessionId }) => this.setState({ sessionId }));
  }

  changeTab = (page) => {
    this.setState({ currentTab: page });
  };

  render() {
    const { currentTab, genres, sessionId } = this.state;
    return (
      <Provider value={genres}>
        <Layout className="container">
          <Tabs defaultActiveKey="1" centered onChange={this.changeTab}>
            {this.pages.map(({ page }) => (
              <TabPane tab={page} key={page}>
                <Row gutter={[32, 32]} justify="center">
                  <Page page={page} sessionId={sessionId} currentTab={currentTab} />
                </Row>
              </TabPane>
            ))}
          </Tabs>
        </Layout>
      </Provider>
    );
  }
}

export default App;
