import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://ceowtukghzqctfwgqwmy.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlb3d0dWtnaHpxY3Rmd2dxd215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Mzg4MzAsImV4cCI6MjA3NDMxNDgzMH0.omBs_F4S6ZZF3zmgUatZM12U6oGxCRjG67S5Nmf3F08";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
