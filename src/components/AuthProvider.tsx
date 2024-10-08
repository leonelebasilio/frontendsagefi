// AuthProvider.tsx

import React, { createContext, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type User = {
  id: string;
};

// conexão supabase

const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext<{ 
  user: User | null; 
  signIn: (email, password) => Promise<void>; 
  isLoading: boolean; 
}>({ user: null, signIn: async () => {}, isLoading: true });

type AuthProviderProps = PropsWithChildren & {
  isSignedIn?: boolean;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession(); 
      if (session?.user) {
        setUser({ id: session.user.id });
      }
      setIsLoading(false); 
    };

    checkUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no Supabase:', error);
        throw error; 
      }

      if (data.user) {
        setUser({ id: data.user.id });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error; // Propaga o erro para tratamento no componente Login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// inicio codigo antigo

// import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
// import { createClient, Session } from '@supabase/supabase-js';

// // Definindo o tipo User aqui mesmo 
// type User = {
//   id: string;
// };

// const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co'; 
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
// const supabase = createClient(supabaseUrl, supabaseKey);

// const AuthContext = createContext<{ user: User | null, signIn: (email, password) => Promise<void> }>({ user: null, signIn: async () => {} });

// type AuthProviderProps = PropsWithChildren & {
//   isSignedIn?: boolean;
// };

// export default function ({
//   children,
//   isSignedIn,
// }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);

//   const signIn = async (email, password) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         console.error('Erro no Supabase:', error);
//         throw error;
//       }

//       if (data.user) {
//         console.log('Login realizado com sucesso!', data.user); 
//         setUser({ id: data.user.id });
//       }
//     } catch (error) {
//       console.error('Erro ao fazer login:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, signIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return context;
// };
