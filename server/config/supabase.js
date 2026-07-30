const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabase,
  isConfigured: () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co')
};
