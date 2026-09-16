import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { EVENT, ABOUT_NAVRATRI, ABOUT_RAAS_RANG } from "./eventConfig";

const defaultSettings = {
  tagline: EVENT.tagline,
  date_label: EVENT.dateLabel,
  venue: EVENT.venue,
  about_navratri: ABOUT_NAVRATRI,
  about_raas_rang: ABOUT_RAAS_RANG,
  contact_email: EVENT.contactEmail,
  whatsapp_number: EVENT.whatsappNumber,
  instagram_handle: EVENT.instagramHandle,
  instagram_url: EVENT.instagramUrl,
  event_date: null,
};

const SiteContentContext = createContext({
  settings: defaultSettings,
  team: [],
  loading: true,
  refresh: async () => {},
});

export function SiteContentProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [{ data: row }, { data: teamRows }] = await Promise.all([
      supabase.from("site_settings").select("*").maybeSingle(),
      supabase.from("team_members").select("*").order("sort_order", { ascending: true }),
    ]);

    if (row) {
      setSettings({
        tagline: row.tagline || defaultSettings.tagline,
        date_label: row.date_label || defaultSettings.date_label,
        venue: row.venue || defaultSettings.venue,
        about_navratri: row.about_navratri || defaultSettings.about_navratri,
        about_raas_rang: row.about_raas_rang || defaultSettings.about_raas_rang,
        contact_email: row.contact_email || defaultSettings.contact_email,
        whatsapp_number: row.whatsapp_number || defaultSettings.whatsapp_number,
        instagram_handle: row.instagram_handle || defaultSettings.instagram_handle,
        instagram_url: row.instagram_url || defaultSettings.instagram_url,
        event_date: row.event_date || null,
      });
    }
    setTeam(teamRows || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SiteContentContext.Provider value={{ settings, team, loading, refresh: load }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
