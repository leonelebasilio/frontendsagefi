// import { useState } from 'react'
// import { Button } from "/SaudeFinanceira/TestAuth/src/components/ui/button"
// import { Input } from "/SaudeFinanceira/TestAuth/src/components/ui/input"
// import { Checkbox } from "C:\\SaudeFinanceira\\TestAuth\\src\\components\\ui\\Checkbox.tsx"
// import { Eye, EyeOff, Brain, HelpCircle, DollarSign } from "lucide-react"
// //import Link from 'next/link'

// const translations = {
//   pt: {
//     home: "Início",
//     features: "Funcionalidades",
//     faq: "Perguntas Frequentes",
//     pricing: "Preços",
//     login: "Entrar",
//     signUp: "Cadastrar",
//     welcomeBack: "Olá, Bem-vindo de volta",
//     enterCredentials: "Digite suas credenciais para continuar",
//     emailUsername: "Email / Nome de usuário",
//     password: "Senha",
//     keepLoggedIn: "Mantenha-me conectado",
//     forgotPassword: "Esqueceu a senha?",
//     signIn: "Entrar",
//     dontHaveAccount: "Não tem uma conta?",
//     signUpLink: "Cadastre-se",
//     orContinueWith: "Ou continue com",
//     googleLogin: "Entrar com Google",
//     privacyPolicy: "Política de Privacidade",
//     termsOfService: "Termos de Serviço",
//     copyright: "© 2023 SageFI. Todos os direitos reservados.",
//     passwordValidation: "A senha deve ter pelo menos 6 caracteres",
//   },
//   en: {
//     home: "Home",
//     features: "Features",
//     faq: "FAQ",
//     pricing: "Pricing",
//     login: "Login",
//     signUp: "Sign Up",
//     welcomeBack: "Hi, Welcome Back",
//     enterCredentials: "Enter your credentials to continue",
//     emailUsername: "Email / Username",
//     password: "Password",
//     keepLoggedIn: "Keep me logged in",
//     forgotPassword: "Forgot Password?",
//     signIn: "Sign In",
//     dontHaveAccount: "Don't have an account?",
//     signUpLink: "Sign up",
//     orContinueWith: "Or continue with",
//     googleLogin: "Login with Google",
//     privacyPolicy: "Privacy Policy",
//     termsOfService: "Terms of Service",
//     copyright: "© 2023 SageFI. All rights reserved.",
//     passwordValidation: "Password must be at least 6 characters long",
//   },
//   es: {
//     home: "Inicio",
//     features: "Características",
//     faq: "Preguntas Frecuentes",
//     pricing: "Precios",
//     login: "Iniciar Sesión",
//     signUp: "Registrarse",
//     welcomeBack: "Hola, Bienvenido de nuevo",
//     enterCredentials: "Ingrese sus credenciales para continuar",
//     emailUsername: "Correo electrónico / Nombre de usuario",
//     password: "Contraseña",
//     keepLoggedIn: "Mantenerme conectado",
//     forgotPassword: "¿Olvidó su contraseña?",
//     signIn: "Iniciar Sesión",
//     dontHaveAccount: "¿No tiene una cuenta?",
//     signUpLink: "Regístrese",
//     orContinueWith: "O continúe con",
//     googleLogin: "Iniciar sesión con Google",
//     privacyPolicy: "Política de Privacidad",
//     termsOfService: "Términos de Servicio",
//     copyright: "© 2023 SageFI. Todos los derechos reservados.",
//     passwordValidation: "La contraseña debe tener al menos 6 caracteres",
//   }
// }

// export default function LoginPage() {
//   const [lang, setLang] = useState('pt')
//   const t = translations[lang]

//   const [showPassword, setShowPassword] = useState(false)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [rememberMe, setRememberMe] = useState(false)
//   const [passwordError, setPasswordError] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (password.length < 6) {
//       setPasswordError(t.passwordValidation)
//       return
//     }
//     setPasswordError('')
//     // Handle login logic here
//     console.log('Login submitted', { email, password, rememberMe })
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col">
//       <header className="bg-white shadow-sm sticky top-0 z-50">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-2xl font-bold text-blue-600">SageFI</Link>
//           </div>
//           <div className="hidden md:flex space-x-4">
//             <Link href="/#features" className="text-gray-600 hover:text-gray-900">{t.features}</Link>
//             <Link href="/#faq" className="text-gray-600 hover:text-gray-900">{t.faq}</Link>
//             <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">{t.pricing}</Link>
//           </div>
//           <div className="flex space-x-4 items-center">
//             <select
//               value={lang}
//               onChange={(e) => setLang(e.target.value)}
//               className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-2"
//             >
//               <option value="pt">PT</option>
//               <option value="en">EN</option>
//               <option value="es">ES</option>
//             </select>
//             <Button variant="ghost">{t.login}</Button>
//             <Button>{t.signUp}</Button>
//           </div>
//         </nav>
//       </header>

//       <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               {t.welcomeBack}
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               {t.enterCredentials}
//             </p>
//           </div>
//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email-username" className="sr-only">{t.emailUsername}</label>
//                 <Input
//                   id="email-username"
//                   name="email"
//                   type="text"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder={t.emailUsername}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="sr-only">{t.password}</label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder={t.password}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {passwordError && (
//               <p className="text-red-500 text-xs italic">{passwordError}</p>
//             )}

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Checkbox
//                   id="remember-me"
//                   name="remember-me"
//                   checked={rememberMe}
//                   onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   {t.keepLoggedIn}
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                   {t.forgotPassword}
//                 </a>
//               </div>
//             </div>

//             <div>
//               <Button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {t.signIn}
//               </Button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-gray-50 text-gray-500">
//                   {t.orContinueWith}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <Button
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"/>
//                   <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"/>
//                   <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"/>
//                   <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"/>
//                 </svg>
//                 {t.googleLogin}
//               </Button>
//             </div>
//           </div>

//           <div className="text-sm text-center">
//             <span>{t.dontHaveAccount} </span>
//             <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//               {t.signUpLink}
//             </a>
//           </div>
//         </div>
//       </main>

//       <footer className="bg-gray-800 text-white py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <span className="text-lg font-semibold mb-4 md:mb-0">SageFI</span>
//             <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
//               <Link href="/#" className="hover:text-blue-300">{t.privacyPolicy}</Link>
//               <Link href="/#" className="hover:text-blue-300">{t.termsOfService}</Link>
//             </div>
//           </div>
//           <p className="mt-4 text-sm text-gray-400 text-center md:text-left">{t.copyright}</p>
//         </div>
//       </footer>
//     </div>
//   )
// }



///#############################################



import React, { useState } from "react";
import { useAuth } from '/SaudeFinanceira/frontendsagefi/src/components/AuthProvider'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signIn(email, password);
      navigate('/Dashboard'); 
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100"> 
      <div className="bg-white p-8 rounded-lg shadow-md w-96"> 
        <h1 className="text-2xl font-semibold text-center mb-6">Página de Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email:
            </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              placeholder="Digite seu email" 
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Senha:
            </label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              placeholder="Digite sua senha" 
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}