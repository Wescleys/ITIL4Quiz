import { createClient } from '@supabase/supabase-js'

// Restaurando chaves originais e funcionais
const supabaseUrl = 'https://omnbdtiaezjfmqdcrbha.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbmJkdGlhZXpqZm1xZGNyYmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDkxMTksImV4cCI6MjA4OTAyNTExOX0.L8vP22E456wTmkplIXT4o9-wwMBXd_Ga0Ud_N0s6I0U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
