import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    forgotPassword: "Esqueceu a senha",
    resetInstructions: "Digite seu email para receber instruções de redefinição de senha",
    email: "Email",
    sendResetLink: "Enviar link de redefinição",
    backToLogin: "Voltar para o login",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    aboutUs: "Quem Somos",
    copyright: "© 2024 Todos os direitos reservados.",
    emailRequired: "Email é obrigatório",
    emailInvalid: "Email inválido",
    resetError: "Erro ao enviar o link de redefinição. Tente novamente.",
    resetSuccess: "Link de redefinição enviado com sucesso! Verifique seu email.",
  },
  en: {
    home: "Home",
    features: "Features",
    faq: "FAQ",
    pricing: "Pricing",
    login: "Login",
    signUp: "Sign Up",
    forgotPassword: "Forgot Password",
    resetInstructions: "Enter your email to receive password reset instructions",
    email: "Email",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to Login",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    copyright: "© 2024 All rights reserved.",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    resetError: "Error sending reset link. Please try again.",
    resetSuccess: "Reset link sent successfully! Check your email.",
  },
  es: {
    home: "Inicio",
    features: "Características",
    faq: "Preguntas Frecuentes",
    pricing: "Precios",
    login: "Iniciar Sesión",
    signUp: "Registrarse",
    forgotPassword: "Olvidé mi contraseña",
    resetInstructions: "Ingrese su correo electrónico para recibir instrucciones de restablecimiento de contraseña",
    email: "Correo electrónico",
    sendResetLink: "Enviar enlace de restablecimiento",
    backToLogin: "Volver al inicio de sesión",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    aboutUs: "Quiénes Somos",
    copyright: "© 2024 Todos los derechos reservados.",
    emailRequired: "El correo electrónico es obligatorio",
    emailInvalid: "Correo electrónico inválido",
    resetError: "Error al enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.",
    resetSuccess: "¡Enlace de restablecimiento enviado con éxito! Revise su correo electrónico.",
  }
};

export default function ForgotPassword() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = t.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.emailInvalid;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setResetSuccess(t.resetSuccess);
        setTimeout(() => navigate('/login'), 5000);
      } catch (error) {
        console.error('Error sending reset link:', error);
        setResetError(t.resetError);
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
          <h1 className="text-2xl font-bold mb-6 text-center">{t.forgotPassword}</h1>
          <p className="text-center text-gray-600 mb-6">{t.resetInstructions}</p>
          
          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}

          {resetSuccess && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{resetSuccess}</AlertDescription>
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
            <Button type="submit" className="w-full">
              {t.sendResetLink}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {t.backToLogin}
            </Link>
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