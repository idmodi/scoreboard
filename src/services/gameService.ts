
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/contexts/DataContext";

export const fetchGames = async () => {
  const { data, error } = await supabase.from('games').select('*');
  if (error) throw error;
  return data;
};

export const createGame = async (name: string) => {
  const { error } = await supabase
    .from('games')
    .insert([{ name, date: new Date().toISOString() }]);
  if (error) throw error;
};

export const deleteGameData = async (id: string) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
