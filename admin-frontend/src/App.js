import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SocketConnection from "./utils/SocketConnection";

function App() {
  return (
    <div>
      <SocketConnection />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
