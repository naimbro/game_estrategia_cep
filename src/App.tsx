import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import JoinGame from './pages/JoinGame';
import WaitingRoom from './pages/WaitingRoom';
import Round from './pages/Round';
import Results from './pages/Results';
import End from './pages/End';

function App() {
  return (
    <Router basename="/game_estrategia_cep">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/waiting/:gameCode" element={<WaitingRoom />} />
        <Route path="/round/:roundNumber" element={<Round />} />
        <Route path="/results/:roundNumber" element={<Results />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </Router>
  );
}

export default App;
