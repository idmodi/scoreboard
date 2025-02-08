
import { supabase } from "@/integrations/supabase/client";
import type { Score } from "@/contexts/DataContext";

export const fetchScores = async () => {
  const { data, error } = await supabase.from('scores').select('*');
  if (error) throw error;
  return data;
};

export const createScore = async (game_id: string, player_id: string, value: number) => {
  const { error } = await supabase
    .from('scores')
    .insert([{ game_id, player_id, value }]);
  if (error) throw error;
};

export const updateScoreData = async (id: string, value: number) => {
  const { error } = await supabase
    .from('scores')
    .update({ value })
    .eq('id', id);
  if (error) throw error;
};

export const deleteScoreData = async (id: string) => {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
