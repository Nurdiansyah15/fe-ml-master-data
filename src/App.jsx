import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";
import setupInterceptors from "./api/setupInterceptors";
import { createBrowserRouter } from "react-router-dom";
import routes from "./routing/route";
import { Toaster } from "sonner";

const router = createBrowserRouter(routes);
setupInterceptors(store);

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </Provider>
  );
}

export default App;
