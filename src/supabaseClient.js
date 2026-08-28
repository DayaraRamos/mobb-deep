import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xqhnipzcztkgofasrmco.supabase.co'
const supabaseAnonKey = 'sb_publishable_SkEiAFJ9a0tEHRpcaIpI_w_dJCw5i_f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)