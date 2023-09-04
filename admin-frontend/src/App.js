import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SocketConnection from "./utils/SocketConnection";
import ViewPublishedActivities from "./components/ViewPublishedActivities";

function App() {
  return (
    <div>
      <SocketConnection />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          exact
          path="/viewPublishedActivities"
          element={<ViewPublishedActivities />}
        />
      </Routes>
    </div>
  );
}

export default App;
