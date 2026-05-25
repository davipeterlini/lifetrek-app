import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const HeartIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ActivityIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const NutritionIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const BrainIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const SleepIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SparklesIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

const FeaturePill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
    <div className="text-white/60">{icon}</div>
    <span className="text-white/60 text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
  </div>
);

export const LoginScreen: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f172a]">
      {/* Animated gradient mesh background with teal/emerald */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f2d2d] to-[#0f172a] opacity-80" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating heart icon watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
        <svg width="800" height="800" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-[420px] transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Glass card */}
          <div className="relative group">
            {/* Glow effect with teal/emerald */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500/50 via-emerald-500/50 to-teal-500/50 rounded-[1.875rem] opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-[1.875rem] border border-white/[0.08] p-10 shadow-2xl overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/30 rounded-2xl blur-xl" />
                    <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 shadow-lg shadow-teal-500/25">
                      <HeartIcon />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    LifeTrek
                  </h1>
                  <p className="text-white/50 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Your comprehensive health & wellness companion
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-10">
                  <FeaturePill icon={<ActivityIcon />} text="Activity" />
                  <FeaturePill icon={<NutritionIcon />} text="Nutrition" />
                  <FeaturePill icon={<SleepIcon />} text="Sleep" />
                  <FeaturePill icon={<BrainIcon />} text="Mental" />
                  <FeaturePill icon={<SparklesIcon />} text="AI Coach" />
                  <FeaturePill icon={<HeartIcon />} text="Health" />
                </div>

                {/* Login button with teal/green gradient */}
                <button
                  onClick={() => signIn()}
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/25 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {/* Button gradient background with teal/emerald */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] via-[#10B981] to-[#059669]" />
                  <div className="absolute inset-[1px] bg-gradient-to-r from-[#14B8A6] via-[#10B981] to-[#059669] rounded-[11px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-white/[0.15] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex items-center justify-center gap-3 py-4 px-6">
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span className="text-white font-semibold">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span className="text-white font-semibold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Continue with Google
                        </span>
                      </>
                    )}
                  </div>
                </button>

                {/* Footer */}
                <p className="text-center text-white/30 text-xs mt-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  By continuing, you agree to our{' '}
                  <button className="text-white/50 hover:text-white/70 underline underline-offset-2 transition-colors">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button className="text-white/50 hover:text-white/70 underline underline-offset-2 transition-colors">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Version badge */}
          <div className="flex justify-center mt-6">
            <span className="text-white/20 text-xs font-mono">v0.1.0</span>
          </div>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};