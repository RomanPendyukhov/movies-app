import { Col, Spin } from 'antd';

function Spinner({ isLoading }) {
  return isLoading ? (
    <Col>
      <Spin size="large" />
    </Col>
  ) : null;
}

export default Spinner;
