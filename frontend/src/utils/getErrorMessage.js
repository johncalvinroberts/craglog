import _get from 'lodash/get';

const fallbackMessage = 'Something went wrong...';
export default (error) => {
  let message;
  if (typeof error.message === 'string') message = error.message;
  if (Array.isArray(error.message)) {
    message = _get(error, 'message[0].constraints.isNotEmpty');
    if (!message) {
      const keys = Object.keys(_get(error, 'message[0].constraints'));

      message = _get(error, `message[0].constraints.${keys[0]}`);
    }
  }
  return message || fallbackMessage;
};
