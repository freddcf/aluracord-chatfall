require('dotenv').config();

module.exports = {
  env: {
    SUPABASE_KEY: process.env.SUPABASE_ANON_KEY,
  },
};