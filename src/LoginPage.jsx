import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-xl flex flex-col gap-4 w-80"
      >
        <input
          className="px-3 py-2 rounded bg-black/50 text-white placeholder-gray-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-3 py-2 rounded bg-black/50 text-white placeholder-gray-400"
          type="password"
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
        <p className="text-xs text-gray-300 text-center">
          Password may be left empty for testing.
        </p>
      </form>
    </div>
  );
}
