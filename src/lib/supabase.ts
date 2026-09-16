import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only klijent — service role (secret) ključ zaobilazi RLS u
// potpunosti, pa se ovaj fajl nikad ne sme uvesti u klijentsku komponentu.
// `import "server-only"` baca grešku već pri build-u ako se to desi slučajno.
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
