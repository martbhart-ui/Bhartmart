import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvlafzlnwjeflimhxgpn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bGFmemxud2plZmxpbWh4Z3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzkwODksImV4cCI6MjEwNDg1NTA4OX0.rBcGMT1ncQeWLqwUlgEFbWOtb5YGEXPcd520Jjbe__U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_IMAGE) {
    target.src = FALLBACK_IMAGE;
  }
};