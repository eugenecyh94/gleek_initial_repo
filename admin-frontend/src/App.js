import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SocketConnection from "./utils/SocketConnection";
import ViewAllActivities from "./components/ViewAllActivities";

function App() {
  return (
    <div>
      <SocketConnection />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          exact
          path="/viewPublishedActivities"
          element={<ViewAllActivities />}
        />
      </Routes>
    </div>
  );
}

export default App;
