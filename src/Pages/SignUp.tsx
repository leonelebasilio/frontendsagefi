import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
const supabase = createClient(supabaseUrl, supabaseKey);

const translations = {
  pt: {
    home: "Início",
    features: "Funcionalidades",
    faq: "Perguntas Frequentes",
    pricing: "Preços",
    login: "Entrar",
    signUp: "Cadastrar",
    createAccount: "Crie sua conta",
    enterDetails: "Digite seus dados para criar uma conta",
    name: "Nome",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirme a senha",
    alreadyHaveAccount: "Já tem uma conta?",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    copyright: "© 2024 Todos os direitos reservados.",
    nameRequired: "Nome é obrigatório",
    emailRequired: "Email é obrigatório",
    emailInvalid: "Email inválido",
    passwordRequired: "Senha é obrigatória",
    passwordMinLength: "A senha deve ter pelo menos 6 caracteres",
    passwordsDontMatch: "As senhas não coincidem",
    signUpError: "Erro ao criar conta. Tente novamente.",
    signUpSuccess: "Conta criada com sucesso! Verifique seu email para confirmar o cadastro.",
    emailConfirmationSent: "Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
    rateLimitExceeded: "Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.",
    tryAgainLater: "Por favor, tente novamente em {seconds} segundos.",
  },
  en: {
    home: "Home",
    features: "Features",
    faq: "FAQ",
    pricing: "Pricing",
    login: "Login",
    signUp: "Sign Up",
    createAccount: "Create your account",
    enterDetails: "Enter your details to create an account",
    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account?",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    copyright: "© 2024 All rights reserved.",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters long",
    passwordsDontMatch: "Passwords don't match",
    signUpError: "Error creating account. Please try again.",
    signUpSuccess: "Account created successfully! Please check your email to confirm your registration.",
    emailConfirmationSent: "A confirmation email has been sent. Please check your inbox.",
    rateLimitExceeded: "Too many attempts. Please wait a few minutes before trying again.",
    tryAgainLater: "Please try again in {seconds} seconds.",
  },
  es: {
    home: "Inicio",
    features: "Características",
    faq: "Preguntas Frecuentes",
    pricing: "Precios",
    login: "Iniciar Sesión",
    signUp: "Registrarse",
    createAccount: "Crea tu cuenta",
    enterDetails: "Ingresa tus datos para crear una cuenta",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Quiénes Somos",
    copyright: "© 2024 Todos los derechos reservados.",
    nameRequired: "El nombre es obligatorio",
    emailRequired: "El correo electrónico es obligatorio",
    emailInvalid: "Correo electrónico inválido",
    passwordRequired: "La contraseña es obligatoria",
    passwordMinLength: "La contraseña debe tener al menos 6 caracteres",
    passwordsDontMatch: "Las contraseñas no coinciden",
    signUpError: "Error al crear la cuenta. Por favor, inténtalo de nuevo.",
    signUpSuccess: "¡Cuenta creada con éxito! Por favor, revisa tu correo electrónico para confirmar tu registro.",
    emailConfirmationSent: "Se ha enviado un correo electrónico de confirmación. Por favor, revisa tu bandeja de entrada.",
    rateLimitExceeded: "Demasiados intentos. Por favor, espera unos minutos antes de intentarlo de nuevo.",
    tryAgainLater: "Por favor, intenta de nuevo en {seconds} segundos.",
  }
};

export default function SignUp() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = t.nameRequired;
    if (!email) newErrors.email = t.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.emailInvalid;
    if (!password) newErrors.password = t.passwordRequired;
    else if (password.length < 6) newErrors.password = t.passwordMinLength;
    if (password !== confirmPassword) newErrors.confirmPassword = t.passwordsDontMatch;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting && cooldownTime === 0) {
      setIsSubmitting(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name,
            },
            emailRedirectTo: `${window.location.origin}/login`,
          }
        });

        if (error) {
          if (error.message.includes('rate limit') || error.status === 429) {
            setSignUpError(t.rateLimitExceeded);
            setCooldownTime(60); // Set a 60-second cooldown
          } else {
            throw error;
          }
        } else if (data) {
          setSignUpSuccess(t.emailConfirmationSent);
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setSignUpError(t.signUpError);
      } finally {
        setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold mb-6 text-center">{t.createAccount}</h1>
          <p className="text-center text-gray-600 mb-6">{t.enterDetails}</p>
          
          {signUpError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{signUpError}</AlertDescription>
            </Alert>
          )}

          {signUpSuccess && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{signUpSuccess}</AlertDescription>
            </Alert>
          )}

          {cooldownTime > 0 && (
            <Alert variant="warning" className="mb-4">
              <AlertDescription>{t.tryAgainLater.replace('{seconds}', cooldownTime.toString())}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t.name}</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
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
            <div>
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || cooldownTime > 0}>
              {isSubmitting ? 'Submitting...' : t.signUp}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p>
              {t.alreadyHaveAccount}{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                {t.login}
              </Link>
            </p>
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