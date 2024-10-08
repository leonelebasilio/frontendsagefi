import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

const translations = {
  pt: {
    home: "Início",
    features: "Funcionalidades",
    faq: "Perguntas Frequentes",
    pricing: "Preços",
    login: "Entrar",
    signUp: "Cadastrar",
    welcomeBack: "Olá, Bem-vindo de volta",
    enterCredentials: "Digite suas credenciais para continuar",
    email: "Email",
    password: "Senha",
    keepLoggedIn: "Mantenha-me conectado",
    forgotPassword: "Esqueceu a senha?",
    signIn: "Entrar",
    dontHaveAccount: "Não tem uma conta?",
    signUpLink: "Cadastre-se",
    orContinueWith: "Ou continue com",
    googleLogin: "Entrar com Google",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    copyright: "© 2024 Todos os direitos reservados.",
    emailRequired: "Email é obrigatório",
    emailInvalid: "Email inválido",
    passwordRequired: "Senha é obrigatória",
    passwordMinLength: "A senha deve ter pelo menos 6 caracteres",
    loginError: "Erro ao fazer login. Verifique suas credenciais.",
  },
  en: {
    home: "Home",
    features: "Features",
    faq: "FAQ",
    pricing: "Pricing",
    login: "Login",
    signUp: "Sign Up",
    welcomeBack: "Hi, Welcome Back",
    enterCredentials: "Enter your credentials to continue",
    email: "Email",
    password: "Password",
    keepLoggedIn: "Keep me logged in",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    dontHaveAccount: "Don't have an account?",
    signUpLink: "Sign up",
    orContinueWith: "Or continue with",
    googleLogin: "Login with Google",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    copyright: "© 2024 All rights reserved.",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters long",
    loginError: "Login error. Please check your credentials.",
  },
  es: {
    home: "Inicio",
    features: "Características",
    faq: "Preguntas Frecuentes",
    pricing: "Precios",
    login: "Iniciar Sesión",
    signUp: "Registrarse",
    welcomeBack: "Hola, Bienvenido de nuevo",
    enterCredentials: "Ingrese sus credenciales para continuar",
    email: "Correo electrónico",
    password: "Contraseña",
    keepLoggedIn: "Mantenerme conectado",
    forgotPassword: "¿Olvidó su contraseña?",
    signIn: "Iniciar Sesión",
    dontHaveAccount: "¿No tiene una cuenta?",
    signUpLink: "Regístrese",
    orContinueWith: "O continúe con",
    googleLogin: "Iniciar sesión con Google",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Quiénes Somos",
    copyright: "© 2024 Todos los derechos reservados.",
    emailRequired: "El correo electrónico es obligatorio",
    emailInvalid: "Correo electrónico inválido",
    passwordRequired: "La contraseña es obligatoria",
    passwordMinLength: "La contraseña debe tener al menos 6 caracteres",
    loginError: "Error al iniciar sesión. Por favor, verifique sus credenciales.",
  }
};

export default function Login() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = t.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.emailInvalid;
    if (!password) newErrors.password = t.passwordRequired;
    else if (password.length < 6) newErrors.password = t.passwordMinLength;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await signIn(email, password);
        navigate('/Dashboard');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        setLoginError(t.loginError);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">SageFI</Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">{t.home}</Link>
            <Link to="/features" className="text-gray-600 hover:text-blue-600">{t.features}</Link>
            <Link to="/faq" className="text-gray-600 hover:text-blue-600">{t.faq}</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600">{t.pricing}</Link>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-2"
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">{t.welcomeBack}</h1>
          <p className="text-center text-gray-600 mb-6">{t.enterCredentials}</p>
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t.keepLoggedIn}
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  {t.forgotPassword}
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t.signIn}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p>
              {t.dontHaveAccount}{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                {t.signUpLink}
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t.orContinueWith}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                {t.googleLogin}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4 mb-2">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600">{t.privacyPolicy}</Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600">{t.termsOfService}</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">{t.aboutUs}</Link>
          </div>
          <p className="text-center text-gray-500 text-sm">{t.copyright}</p>
        </div>
      </footer>
    </div>
  );
}