import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api, setStoredAuth } from '../services/api';
import { User } from '../types';
import { MedicalPlusMark } from './BrandLogo';

interface RegisterPageProps {
  onSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Frontend validation
    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter confirm password.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.register({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      if (res.success && res.data) {
        setSuccessMsg('Account registered successfully! Logging you in...');
        
        // Auto-login after successful registration
        const loginRes = await api.auth.login({
          email: email.trim(),
          password: password,
        });

        if (loginRes.success && loginRes.data) {
          const { user, access, refresh } = loginRes.data;
          setStoredAuth({ access, refresh }, user);
          setTimeout(() => {
            onSuccess({
              id: user.id || `u-${Date.now()}`,
              name: user.name || fullName.trim(),
              email: user.email || email.trim(),
              role: 'STAFF',
              is_staff: true,
              avatarInitial: (user.name || fullName.trim()).charAt(0).toUpperCase(),
            });
          }, 800);
        } else {
          // If login fails (or in preview mode), continue directly
          setTimeout(() => {
            onSuccess({
              id: res.data?.id || `u-${Date.now()}`,
              name: fullName.trim(),
              email: email.trim(),
              role: 'STAFF',
              is_staff: true,
              avatarInitial: fullName.trim().charAt(0).toUpperCase(),
            });
          }, 1000);
        }
      } else {
        // Handle server errors
        setError(res.error || 'Registration failed. Please check your credentials and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FAF8F5] text-[#1C2B2E] selection:bg-[#2F6F62] selection:text-white">
      {/* Left Brand Panel */}
      <div className="w-full md:w-1/2 lg:w-[48%] bg-[#133E2B] text-white p-8 md:p-14 lg:p-18 flex flex-col justify-between relative overflow-hidden">
        {/* Background concentric geometric lines */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="380" r="180" stroke="white" strokeWidth="1.2" />
            <circle cx="150" cy="380" r="260" stroke="white" strokeWidth="1.2" />
            <circle cx="150" cy="380" r="340" stroke="white" strokeWidth="1.2" />
            <circle cx="150" cy="380" r="420" stroke="white" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <MedicalPlusMark size={28} />
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-serif font-bold tracking-tight text-white">Meridian</span>
              <span className="text-2xl font-serif font-semibold text-[#86CDAF]">Health</span>
            </div>
          </div>
        </div>

        {/* Middle Hero Statement */}
        <div className="my-12 md:my-auto relative z-10 max-w-lg">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18]">
            Set up your account in under a minute.
          </h1>
          <p className="mt-5 text-[#B6D6CA] text-base sm:text-lg font-sans font-normal leading-relaxed">
            You'll be able to add patients and doctors right away — no admin approval wait.
          </p>
        </div>

        {/* Bottom Metrics */}
        <div className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">128ms</div>
            <div className="text-[10px] sm:text-xs tracking-wider text-[#A2C7B8] uppercase font-mono mt-1">AVG RESPONSE</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">99.98%</div>
            <div className="text-[10px] sm:text-xs tracking-wider text-[#A2C7B8] uppercase font-mono mt-1">UPTIME</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">4,200+</div>
            <div className="text-[10px] sm:text-xs tracking-wider text-[#A2C7B8] uppercase font-mono mt-1">RECORDS MANAGED</div>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="w-full md:w-1/2 lg:w-[52%] flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 bg-[#FAF8F5]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-[34px] font-serif font-bold text-[#1C2B2E] tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-[#54636A] text-sm sm:text-base font-sans">
              Register to start managing patients and doctors.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-6 p-3.5 bg-[#FDF2F2] border border-[#F5C6CB] rounded-md flex items-start space-x-3 text-[#A13D3D] text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 bg-[#EAF5F1] border border-[#BDE3D5] rounded-md flex items-start space-x-3 text-[#1F4B41] text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-sm font-medium text-[#2E3C40] mb-1.5">
                Full name
              </label>
              <input
                id="reg-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Asha Rao"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CEC2] rounded-md text-[#1C2B2E] placeholder-[#9E978C] text-base focus:outline-none focus:ring-2 focus:ring-[#1F4B41] focus:border-transparent transition-shadow"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-[#2E3C40] mb-1.5">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CEC2] rounded-md text-[#1C2B2E] placeholder-[#9E978C] text-base focus:outline-none focus:ring-2 focus:ring-[#1F4B41] focus:border-transparent transition-shadow"
              />
            </div>

            {/* Password with View/Hide icon */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-[#2E3C40] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full pl-3.5 pr-11 py-2.5 bg-white border border-[#D5CEC2] rounded-md text-[#1C2B2E] placeholder-[#9E978C] text-base focus:outline-none focus:ring-2 focus:ring-[#1F4B41] focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C888D] hover:text-[#1C2B2E] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password with View/Hide icon */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-[#2E3C40] mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full pl-3.5 pr-11 py-2.5 bg-white border border-[#D5CEC2] rounded-md text-[#1C2B2E] placeholder-[#9E978C] text-base focus:outline-none focus:ring-2 focus:ring-[#1F4B41] focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  id="btn-toggle-confirm-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C888D] hover:text-[#1C2B2E] transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-create-account"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1F4B41] hover:bg-[#163830] text-white font-medium text-base rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="mt-8 text-left">
            <span className="text-[#54636A] text-sm">
              Already registered?{' '}
            </span>
            <button
              type="button"
              id="link-switch-to-login"
              onClick={onSwitchToLogin}
              className="text-[#1F4B41] hover:text-[#133E2B] font-medium text-sm hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
