import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Form URL Encoded for OAuth2PasswordBearer
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const res = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        if (!res.ok) throw new Error('Invalid credentials');
        const data = await res.json();
        
        // Use placeholder user for now, or fetch from /me endpoint
        login(data.access_token, { username, email: '', role: 'admin' });
        navigate('/');
      } else {
        const res = await fetch('http://localhost:8000/api/v1/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role: 'admin' }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Signup failed');
        }
        // Switch to login after successful signup
        setIsLogin(true);
        setError('Signup successful! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="bg-primary/20 p-3 rounded-xl border border-primary/30">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black font-['Outfit'] tracking-tight text-white m-0 leading-none">SENTINEL</h2>
            <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] m-0">OMNI INTELLIGENCE</p>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white font-['Outfit']">
          {isLogin ? 'Authenticate Access' : 'Register Operator Credentials'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-primary/10 sm:rounded-2xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-3 text-sm rounded-lg border flex items-center gap-2 ${error.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                <div className="font-medium">{error}</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300">Operator ID (Username)</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 bg-slate-800/50 border border-white/10 rounded-lg focus:ring-primary focus:border-primary sm:text-sm text-white py-2.5 transition-colors"
                  placeholder="Enter operator designation"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300">Comms Link (Email)</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full bg-slate-800/50 border border-white/10 rounded-lg focus:ring-primary focus:border-primary sm:text-sm text-white px-3 py-2.5 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300">Authorization Key</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-slate-800/50 border border-white/10 rounded-lg focus:ring-primary focus:border-primary sm:text-sm text-white py-2.5 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold font-['Outfit'] text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-slate-900 uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Initiate Link' : 'Register Operator')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? 'Request new operator credentials?' : 'Already hold authorization? Link up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
