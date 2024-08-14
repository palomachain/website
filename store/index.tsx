import { api } from "services";
import { configureStore } from "@reduxjs/toolkit";
import requestTool from "./request";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, requestTool.rtkQueryErrorHandler),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
