import "./App.css";
import { Route, Routes } from "react-router-dom";
import ActivityList from "./components/activity/ActivityList";
import SocketConnection from "./utils/SocketConnection";

function App() {
  return (
    <div>
      <SocketConnection />
      <Routes>
        <Route exact path="/" element={<ActivityList />} />
      </Routes>
    </div>
  );
}

export default App;
