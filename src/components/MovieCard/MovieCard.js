import { Component } from 'react';
import { Card, Image, Rate, Tag, Typography } from 'antd';
import format from 'date-fns/format';
import classNames from 'classnames';

import './MovieCard.css';
import cutText from '../../utility/cuttext';
import image404 from '../../img/image404.png';
import { Consumer } from '../context';

const { Title, Paragraph, Text } = Typography;

class MovieCard extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    };
  }

  onChangeRate = (value) => {
    const { changeRate, movieId } = this.props;
    this.setState({ value });
    changeRate(movieId, value);
  };

  render() {
    const { title, overview, date, poster, movieId, genreId } = this.props;
    const { value } = this.state;
    const stars = +localStorage.getItem(movieId) || value;
    let { rating } = this.props;
    const rateClass = classNames({
      rating: true,
      'to-three': rating <= 3,
      'to-five': rating > 3 && rating <= 5,
      'to-seven': rating > 5 && rating <= 7,
      'to-ten': rating > 7 && rating <= 10,
    });

    if (rating.toString().length === 1) rating = `${rating}.0`;

    return (
      <Consumer>
        {(genres) => (
          <Card hoverable>
            <Image src={poster ? `https://image.tmdb.org/t/p/w500/${poster}` : image404} />
            <Title level={3}>{title}</Title>
            <div className={rateClass}>{rating}</div>
            <Text>{date ? format(new Date(date), 'd MMMM, Y') : 'Unknown'}</Text>
            <div className="card-tags">
              {genreId.map((id) => {
                const genre = genres.find((g) => g.id === id);
                return <Tag key={genre.id}>{genre.name}</Tag>;
              })}
            </div>
            <Paragraph>{cutText(overview)}</Paragraph>
            <Rate allowHalf count={10} value={stars} onChange={this.onChangeRate} />
          </Card>
        )}
      </Consumer>
    );
  }
}

export default MovieCard;
