import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './components/Login';
import CreatePoll from './components/CreatePoll';
import VotingPage from './components/VotingPage';
import MyPolls from './components/MyPolls';

function Home() {
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  if (!username) {
    return <AuthForm onLogin={setUsername} />;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px'
      }}>
        <p style={{ color: '#fff', margin: 0 }}>Logged in as {username}</p>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#fff',
            color: '#065F46',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Log out
        </button>
      </div>
      <CreatePoll />
      <MyPolls />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poll/:id" element={<VotingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;