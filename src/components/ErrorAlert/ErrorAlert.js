import { Alert } from 'antd';

function ErrorAlert({ error }) {
  return error ? (
    <Alert message="Error" description="Error! Check your internet connection!" type="error" showIcon />
  ) : null;
}

export default ErrorAlert;
