import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 = details, 2 = verification code
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, confirmRegister, login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(email, password);
    setIsSubmitting(false);
    if (success) {
      setStep(2);
      toast.success("Verification code sent to your email!");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await confirmRegister(email, code);
    if (success) {
      // Auto login after confirm
      await login(email, password);
      setIsSubmitting(false);
      navigate('/admin');
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              {step === 1 ? <Package size={32} /> : <CheckCircle2 size={32} />}
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {step === 1 ? "Join VoltCommerce to access wholesale pricing" : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Business Email</label>
              <input 
                type="email" 
                required
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Secure Password</label>
              <input 
                type="password" 
                required
                minLength={8}
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? "Creating account..." : "Continue"} 
              {!isSubmitting && <ArrowRight size={20} />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Verification Code</label>
              <input 
                type="text" 
                required
                maxLength={6}
                className="w-full border border-slate-300 rounded-xl p-3 text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? "Verifying..." : "Verify & Login"} 
            </Button>
            
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Back to signup
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-sm text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Lock size={12} />
          <span>Secured by AWS Cognito</span>
        </div>
      </div>
    </div>
  );
}
