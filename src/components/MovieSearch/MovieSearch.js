import { Col, Input } from 'antd';
import _debounce from 'lodash.debounce';

function MovieSearch({ onChangeQuery }) {
  const onChangeHandle = (event) => {
    const query = event.target.value;

    if (!query.trim()) return;
    onChangeQuery(query);
  };

  return (
    <Col span={24}>
      <Input placeholder="Type to search..." onChange={_debounce(onChangeHandle, 500)} />
    </Col>
  );
}

export default MovieSearch;
