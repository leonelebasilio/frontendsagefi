import { createClient } from '@supabase/supabase-js';

// Acesse as variáveis de ambiente usando import.meta.env no Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não encontradas! Verifique seu arquivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;