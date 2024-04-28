import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import Layout from "./layout/Layout";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="dark:bg-[#141625] bg-[#f8f8fb]">
          <Layout />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
