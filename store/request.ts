import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const rtkQueryErrorHandler: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    // console.warn("We got a rejected action!");
    // toast.warn("Async error!");
  }

  return next(action);
};

const request = {
  rtkQueryErrorHandler,
};

export default request;
