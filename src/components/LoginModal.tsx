import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToTrial: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToTrial }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoggedIn(true);
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };

  const handleClose = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!loggedIn ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-[#FF5722] flex items-center justify-center text-white text-xs font-bold">
                DF
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                app.duefox.co
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Log in to DueFox
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
              Access your live collections ledger and cadence settings.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <span className="text-xs text-[#FF5722] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl transition-all shadow-md glow-orange-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 text-center text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onSwitchToTrial();
                  }}
                  className="text-[#FF5722] font-semibold hover:underline cursor-pointer"
                >
                  Start free trial (5 invoices free) →
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome back!</h3>
            <p className="text-xs text-slate-300">
              Authenticated as <strong className="text-white">{email}</strong>. Ready to access your automated collections ledger.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl text-xs transition-all shadow-md glow-orange flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter DueFox Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Stay on Landing Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
