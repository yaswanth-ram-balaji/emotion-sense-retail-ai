
import { createClient } from "@supabase/supabase-js";

// These values are safe for client-side use, as indicated by your Supabase project details
const supabaseUrl = "https://pnnzbmlnfddkwtlbawxn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubnpibWxuZmRka3d0bGJhd3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzY4MDgsImV4cCI6MjA2NTU1MjgwOH0.qxF0G8CFLWG0NtjUyXzIDikGsvAXlSGxReamYTgkf0g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

