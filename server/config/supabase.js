const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabase,
  isConfigured: () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co' && !process.env.SUPABASE_URL.includes('your-supabase-project'))
};
