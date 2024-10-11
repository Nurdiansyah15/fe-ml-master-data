import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";
import { setupInterceptors } from "./api/axiosInterceptors";
import { createBrowserRouter } from "react-router-dom";
import routes from "./routing/route";

const router = createBrowserRouter(routes);
setupInterceptors(store);

function App() {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </Provider>
  );
}

export default App;
