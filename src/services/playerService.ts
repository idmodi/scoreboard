
import { supabase } from "@/integrations/supabase/client";
import type { Player } from "@/contexts/DataContext";

export const fetchPlayers = async () => {
  const { data, error } = await supabase.from('players').select('*');
  if (error) throw error;
  return data;
};

export const createPlayer = async (name: string, avatarUrl?: string) => {
  const { error } = await supabase
    .from('players')
    .insert([{ name, avatar_url: avatarUrl }]);
  if (error) throw error;
};

export const updatePlayerData = async (id: string, name: string, avatarUrl?: string) => {
  const { error } = await supabase
    .from('players')
    .update({ name, avatar_url: avatarUrl })
    .eq('id', id);
  if (error) throw error;
};

export const deletePlayerData = async (id: string) => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
