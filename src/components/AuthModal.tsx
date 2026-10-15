import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  School,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { registerWithEmail, loginWithEmail, StudentProfile, isAdminUser, ADMIN_PASS } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: StudentProfile) => void;
  reasonMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  reasonMessage,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up fields
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    university: '',
    hostel: '',
    city: '',
    pincode: '',
  });

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Check for Admin Credentials (rehanpateljrrvs@gmail.com or rehanpatel6269@gmail.com / 454545)
    if (isAdminUser(loginEmail.trim()) && loginPassword === ADMIN_PASS) {
      localStorage.setItem('jrrvs_admin_auth', 'true');
      const adminProfile: StudentProfile = {
        id: 'admin-rehan',
        email: loginEmail.trim().toLowerCase(),
        displayName: 'Rehan Patel (Admin)',
        university: 'JRRVS Apparel HQ',
        createdAt: new Date().toISOString(),
      };
      setSuccessMessage('Admin credentials verified! Authorized as Store Administrator.');
      setTimeout(() => {
        onAuthSuccess(adminProfile);
        onClose();
      }, 500);
      setLoading(false);
      return;
    }

    try {
      const profile = await loginWithEmail(loginEmail.trim(), loginPassword);
      if (profile) {
        setSuccessMessage('Welcome back! Authentication successful.');
        setTimeout(() => {
          onAuthSuccess(profile);
          onClose();
        }, 600);
      } else {
        setErrorMessage('Unable to retrieve profile. Please check credentials or create an account.');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMessage('Invalid student email or password. If you haven\'t created an account yet, switch to "Create Account" above to register.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please wait a moment before trying again.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in. Please verify your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signupData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const profile = await registerWithEmail(
        signupData.email.trim(),
        signupData.password,
        signupData.name.trim(),
        {
          phone: signupData.phone.trim(),
          university: signupData.university.trim(),
          hostel: signupData.hostel.trim(),
          city: signupData.city.trim(),
          pincode: signupData.pincode.trim(),
        }
      );

      setSuccessMessage('Student account created & saved to Firebase!');
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Try signing in.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Please provide a valid email format.');
      } else {
        setErrorMessage(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Helper (for testing convenience)
  const handleDemoSignIn = async () => {
    setLoginEmail('aryan.patel@campus.edu.in');
    setLoginPassword('jrrvs1234');
    setLoading(true);
    setErrorMessage('');

    try {
      // Try login first
      const profile = await loginWithEmail('aryan.patel@campus.edu.in', 'jrrvs1234');
      if (profile) {
        onAuthSuccess(profile);
        onClose();
        return;
      }
    } catch {
      // If not yet created, register demo account
      try {
        const profile = await registerWithEmail(
          'aryan.patel@campus.edu.in',
          'jrrvs1234',
          'Aryan Patel',
          {
            phone: '9876543210',
            university: 'Delhi University (North Campus)',
            hostel: 'Jubilee Hall Hostel, Room 204',
            city: 'New Delhi',
            pincode: '110007',
          }
        );
        onAuthSuccess(profile);
        onClose();
      } catch (e: any) {
        setErrorMessage('Demo sign in failed: ' + (e.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#121316] border border-[#222428] rounded-xl p-6 sm:p-8 shadow-2xl my-auto text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full bg-[#1c1d22]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Reason banner if triggered before checkout */}
        {reasonMessage && (
          <div className="mb-5 p-3 bg-white/5 border border-white/10 rounded-lg flex items-start gap-2.5 text-xs font-mono text-zinc-300">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{reasonMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="font-heading text-2xl font-black uppercase tracking-tight block">
            jrrvs account
          </span>
          <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-widest">
            Campus Identity & Order Vault
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222428] mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              tab === 'signin'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#71717a] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              tab === 'signup'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#71717a] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 rounded text-red-300 text-xs font-mono space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {tab === 'signin' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSignupData((prev) => ({ ...prev, email: loginEmail || prev.email }));
                    setTab('signup');
                    setErrorMessage('');
                  }}
                  className="text-white underline underline-offset-2 hover:text-emerald-300 text-[11px] font-bold"
                >
                  Click here to register account with this email →
                </button>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN FORM */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                Student Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@university.edu.in"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded pl-9 pr-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded pl-9 pr-10 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#71717a] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-[#e4e4e7] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Button */}
            <div className="pt-3 border-t border-[#1f2024] text-center">
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                1-Click Student Demo Sign In (Aryan Patel)
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Aryan Patel"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                Student Email *
              </label>
              <input
                type="email"
                required
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="name@university.edu.in"
                className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                Create Password (Min 6 chars) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 pr-10 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#71717a] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                College / University Campus
              </label>
              <input
                type="text"
                value={signupData.university}
                onChange={(e) => setSignupData({ ...signupData, university: e.target.value })}
                placeholder="e.g. Delhi University, IIT Bombay, BITS, Christ"
                className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                Hostel Block & Room # or Address
              </label>
              <input
                type="text"
                value={signupData.hostel}
                onChange={(e) => setSignupData({ ...signupData, hostel: e.target.value })}
                placeholder="e.g. Hostel Block B, Room 204"
                className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={signupData.city}
                  onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                  placeholder="New Delhi"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={signupData.pincode}
                  onChange={(e) => setSignupData({ ...signupData, pincode: e.target.value })}
                  placeholder="110007"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-[#e4e4e7] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering on Firebase...</span>
              ) : (
                <>
                  <span>Create Account & Save Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-[#1e2024] text-center">
          <p className="text-[10px] text-[#71717a] font-mono">
            Store Administrator? Login with admin credentials (<span className="text-amber-400">rehanpateljrrvs@gmail.com</span>) or access the Admin Portal from the top bar.
          </p>
        </div>

      </div>
    </div>
  );
};
