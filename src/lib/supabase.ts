import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://swqtvkemojzteflsgiry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cXR2a2Vtb2p6dGVmbHNnaXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjcwODIsImV4cCI6MjA0ODMwMzA4Mn0.kgTzcXr4dnnhlaPaR7ZvpIYQLSf3yQTpY9MFrlsfJNI';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);