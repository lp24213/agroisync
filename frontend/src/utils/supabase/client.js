import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Supabase] Variáveis REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY não configuradas. Cliente não será criado.'
      );
    }
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
