import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tggkfozxcvqidrnbehwg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ2tmb3p4Y3ZxaWRybmJlaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNTg0OTIsImV4cCI6MjA5OTkzNDQ5Mn0.4i74_Fv_-3awoNvtq7xxbHBJGFfEM9m3GOa1eF8T_EY'

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

async function test() {
  const { data, error } = await supabase.from('survey_responses').insert([{ responses: { test: true } }])
  if (error) {
    console.error('ERROR:', error)
    console.error('MESSAGE:', error.message)
    console.error('DETAILS:', error.details)
    console.error('HINT:', error.hint)
    console.error('CODE:', error.code)
  } else {
    console.log('SUCCESS:', data)
  }
}

test()
