const { createClient } = require("@supabase/supabase-js");

async function getActiveTicketTypes() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from("ticket_types")
    .select("id, name, price, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

module.exports = { getActiveTicketTypes };
