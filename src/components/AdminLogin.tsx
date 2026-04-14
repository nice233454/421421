import { useState, FormEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: (username: string, password: string) => boolean;
}

export default function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 400));
    const ok = onLogin(username, password);
    if (!ok) {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-full bg-amber-400/10 items-center justify-center mb-6">
            <Lock className="text-amber-400" size={24} />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-stone-500 mt-2 text-sm">Artist Portfolio Management</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-stone-950 border border-stone-800 rounded-sm p-8 space-y-6">
          <div>
            <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors duration-200 text-sm"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 pr-12 rounded-sm outline-none transition-colors duration-200 text-sm"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-black font-bold py-3 rounded-sm transition-colors duration-200 text-sm tracking-widest uppercase"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
