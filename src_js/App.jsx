import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/stockStore";
import DashboardLayout from "./components/layout/DashboardLayout";
import AppRoutes from "./routes/AppRoutes";

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DashboardLayout>
          <AppRoutes />
        </DashboardLayout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
