import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, Building2, Eye, EyeOff } from 'lucide-react';
import { User as UserType, Language } from '../../types';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

const authTexts = {
  pt: {
    heroTitle: 'O seu funcionário virtual com IA.',
    heroDesc: 'Converse com a IA e ela cria clientes, orçamentos, contratos, cobranças e organiza toda a sua empresa automaticamente.',
    welcomeBack: 'Bem-vindo de volta',
    createAccount: 'Crie sua conta',
    subtitle: 'Seu funcionário virtual com IA',
    googleBtnLogin: 'Entrar com Google',
    googleBtnSignup: 'Criar conta com Google',
    orEmail: 'ou continue com email',
    fullNameLabel: 'Nome Completo',
    fullNamePlaceholder: 'Seu nome ou de sua empresa',
    emailLabel: 'Email',
    emailPlaceholder: 'admin@erpai.pro',
    passwordLabel: 'Senha',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu a senha?',
    loginSubmit: 'Entrar na Plataforma',
    signupSubmit: 'Criar Minha Conta',
    noAccount: 'Não tem conta?',
    signUpLink: 'Criar conta',
    hasAccount: 'Já tem uma conta?',
    loginLink: 'Entrar',
    demoAccess: '⚡ Acessar como Convidado (Modo Demo)',
    tagline: 'Inspirado em Linear · Notion · Stripe',
    features: [
      'Orçamentos e contratos em PDF instantâneos',
      'Agente IA para WhatsApp e automação de cobranças',
      'Gestão de estoque, CRM e relatórios financeiros',
    ],
  },
  en: {
    heroTitle: 'Your AI Virtual Employee.',
    heroDesc: 'Chat with the AI and it automatically creates clients, quotes, contracts, invoices, and manages your entire business.',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    subtitle: 'Your AI Virtual Employee',
    googleBtnLogin: 'Sign in with Google',
    googleBtnSignup: 'Sign up with Google',
    orEmail: 'or continue with email',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Your name or business name',
    emailLabel: 'Email',
    emailPlaceholder: 'admin@erpai.pro',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginSubmit: 'Sign In to Platform',
    signupSubmit: 'Create My Account',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign up',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign in',
    demoAccess: '⚡ Access as Guest (Demo Mode)',
    tagline: 'Inspired by Linear · Notion · Stripe',
    features: [
      'Instant PDF quotes & contracts',
      'WhatsApp AI Agent & payment reminders',
      'Inventory, CRM & financial reporting',
    ],
  },
  es: {
    heroTitle: 'Tu empleado virtual con IA.',
    heroDesc: 'Chatea con la IA y crea clientes, presupuestos, contratos, cobros y organiza toda tu empresa automáticamente.',
    welcomeBack: 'Bienvenido de nuevo',
    createAccount: 'Crea tu cuenta',
    subtitle: 'Tu empleado virtual con IA',
    googleBtnLogin: 'Iniciar sesión con Google',
    googleBtnSignup: 'Registrarse con Google',
    orEmail: 'o continúa con email',
    fullNameLabel: 'Nombre Completo',
    fullNamePlaceholder: 'Tu nombre o el de tu empresa',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'admin@erpai.pro',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginSubmit: 'Entrar a la Plataforma',
    signupSubmit: 'Crear Mi Cuenta',
    noAccount: '¿No tienes cuenta?',
    signUpLink: 'Crear cuenta',
    hasAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Iniciar sesión',
    demoAccess: '⚡ Acceder como Invitado (Modo Demo)',
    tagline: 'Inspirado en Linear · Notion · Stripe',
    features: [
      'Presupuestos y contratos en PDF instantáneos',
      'Agente IA para WhatsApp y automatización de cobros',
      'Gestión de inventario, CRM y estados financieros',
    ],
  },
  fr: {
    heroTitle: 'Votre employé virtuel avec IA.',
    heroDesc: 'Discutez avec l\'IA et elle crée des clients, des devis, des contrats, des factures et gère toute votre entreprise.',
    welcomeBack: 'Bon retour parmi nous',
    createAccount: 'Créer votre compte',
    subtitle: 'Votre employé virtuel avec IA',
    googleBtnLogin: 'Se connecter avec Google',
    googleBtnSignup: 'S\'inscrire avec Google',
    orEmail: 'ou continuer avec un e-mail',
    fullNameLabel: 'Nom Complet',
    fullNamePlaceholder: 'Votre nom ou nom d\'entreprise',
    emailLabel: 'E-mail',
    emailPlaceholder: 'admin@erpai.pro',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    loginSubmit: 'Se connecter à la plateforme',
    signupSubmit: 'Créer mon compte',
    noAccount: 'Vous n\'avez pas de compte ?',
    signUpLink: 'Créer un compte',
    hasAccount: 'Déjà un compte ?',
    loginLink: 'Se connecter',
    demoAccess: '⚡ Accès Invité (Mode Démo)',
    tagline: 'Inspiré par Linear · Notion · Stripe',
    features: [
      'Devis et contrats PDF instantanés',
      'Agent IA WhatsApp et relances de paiement',
      'Stock, CRM et rapports financiers',
    ],
  },
};

export const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  language = 'pt',
  onSelectLanguage,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@erpai.pro');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const safeLang = language && authTexts[language] ? language : 'pt';
  const t = authTexts[safeLang];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserType = {
        id: `u_${Date.now()}`,
        name: name.trim() || (isSignUp ? 'Novo Gestor' : 'Gestor Principal'),
        email: email.trim() || 'admin@erpai.pro',
        role: 'admin',
        companyId: 'comp_1',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      onLogin(user);
    }, 600);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserType = {
        id: `u_google_${Date.now()}`,
        name: 'Gestor Google ERP',
        email: 'gestor@erpai.pro',
        role: 'admin',
        companyId: 'comp_1',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      onLogin(googleUser);
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: UserType = {
        id: 'u_demo',
        name: 'Carlos Mendes (Demo)',
        email: 'admin@erpai.pro',
        role: 'admin',
        companyId: 'comp_1',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      onLogin(demoUser);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* LEFT SIDE: Brand Hero Canvas (Hidden on small mobile, visible on md+) */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-7/12 flex-col justify-between p-8 lg:p-14 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 overflow-hidden">
        {/* Background ambient lighting effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 flex items-center justify-center text-emerald-300 font-black text-xl shadow-lg">
              E
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">ERP AI PRO</span>
          </div>

          {/* Language Switcher Badge */}
          {onSelectLanguage && (
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
              {(['pt', 'en', 'es', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLanguage(l)}
                  className={`px-2 py-0.5 rounded-full uppercase font-bold text-[10px] transition-all ${
                    safeLang === l ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hero Copy & Features Section */}
        <div className="relative z-10 max-w-xl my-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal mb-8">
            {t.heroDesc}
          </p>

          <div className="space-y-3.5 pt-2">
            {t.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="relative z-10 text-xs text-emerald-200/60 font-medium">
          {t.tagline}
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login / Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 bg-slate-900 text-slate-100 relative">
        {/* Mobile Header Logo */}
        <div className="md:hidden flex items-center justify-between w-full max-w-md mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
              E
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">ERP AI PRO</span>
          </div>

          {onSelectLanguage && (
            <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 text-xs">
              {(['pt', 'en', 'es', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLanguage(l)}
                  className={`px-1.5 py-0.5 rounded uppercase font-bold text-[10px] ${
                    safeLang === l ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Container Card */}
        <div className="w-full max-w-md space-y-6">
          {/* Card Header Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isSignUp ? t.createAccount : t.welcomeBack}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              {t.subtitle}
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-white font-semibold text-sm transition-all hover:border-slate-600 active:scale-[0.99] shadow-sm"
          >
            {/* Google Colorful G SVG Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSignUp ? t.googleBtnSignup : t.googleBtnLogin}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold shrink-0">
              {t.orEmail}
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <button type="button" className="text-emerald-400 hover:underline">
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{isLoading ? 'Carregando...' : isSignUp ? t.signupSubmit : t.loginSubmit}</span>
            </button>
          </form>

          {/* Quick Guest Demo Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.demoAccess}</span>
            </button>
          </div>

          {/* Toggle Login/Sign Up Switch */}
          <div className="text-center text-xs text-slate-400 pt-2">
            <span>{isSignUp ? t.hasAccount : t.noAccount} </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-bold text-emerald-400 hover:underline ml-1"
            >
              {isSignUp ? t.loginLink : t.signUpLink}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
