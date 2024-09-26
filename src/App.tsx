import React from "react";
import Layout from "./layout";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};

export default App;
