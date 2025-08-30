import { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? (
    <LandingPage />
  ) : (
    <LoginPage onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
