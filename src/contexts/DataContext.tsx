
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import * as playerService from '@/services/playerService';
import * as gameService from '@/services/gameService';
import * as scoreService from '@/services/scoreService';

export interface Player {
  id: string;
  name: string;
  avatar_url?: string | null;
  created_at?: string;
}

export interface Score {
  id: string;
  game_id: string;
  player_id: string;
  value: number;
  created_at?: string;
}

export interface Game {
  id: string;
  name: string;
  date: string;
  created_at?: string;
}

interface DataContextType {
  players: Player[];
  games: Game[];
  scores: Score[];
  addPlayer: (name: string, avatarUrl?: string) => Promise<void>;
  addGame: (name: string) => Promise<void>;
  addScore: (gameId: string, playerId: string, value: number) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  deleteScore: (id: string) => Promise<void>;
  updatePlayer: (id: string, name: string, avatarUrl?: string) => Promise<void>;
  updateScore: (id: string, value: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const [playersData, gamesData, scoresData] = await Promise.all([
          playerService.fetchPlayers(),
          gameService.fetchGames(),
          scoreService.fetchScores()
        ]);

        if (playersData) setPlayers(playersData);
        if (gamesData) setGames(gamesData);
        if (scoresData) setScores(scoresData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    loadData();

    // Set up real-time subscriptions
    const playersSubscription = supabase
      .channel('players-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPlayers(prev => [...prev, payload.new as Player]);
        } else if (payload.eventType === 'DELETE') {
          setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new as Player : p));
        }
      })
      .subscribe();

    const gamesSubscription = supabase
      .channel('games-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setGames(prev => [...prev, payload.new as Game]);
        } else if (payload.eventType === 'DELETE') {
          setGames(prev => prev.filter(g => g.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setGames(prev => prev.map(g => g.id === payload.new.id ? payload.new as Game : g));
        }
      })
      .subscribe();

    const scoresSubscription = supabase
      .channel('scores-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setScores(prev => [...prev, payload.new as Score]);
        } else if (payload.eventType === 'DELETE') {
          setScores(prev => prev.filter(s => s.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setScores(prev => prev.map(s => s.id === payload.new.id ? payload.new as Score : s));
        }
      })
      .subscribe();

    return () => {
      playersSubscription.unsubscribe();
      gamesSubscription.unsubscribe();
      scoresSubscription.unsubscribe();
    };
  }, [toast]);

  const addPlayer = async (name: string, avatarUrl?: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to add players.",
        variant: "destructive",
      });
      return;
    }

    try {
      await playerService.createPlayer(name, avatarUrl);
      toast({
        title: "Player added",
        description: `${name} has been added to the player list.`,
      });
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: "Error adding player",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const addGame = async (name: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to add games.",
        variant: "destructive",
      });
      return;
    }

    try {
      await gameService.createGame(name);
      toast({
        title: "Game added",
        description: `${name} has been added to the games list.`,
      });
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        title: "Error adding game",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const addScore = async (game_id: string, player_id: string, value: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to add scores.",
        variant: "destructive",
      });
      return;
    }

    try {
      await scoreService.createScore(game_id, player_id, value);
      toast({
        title: "Score added",
        description: `New score of ${value} has been recorded.`,
      });
    } catch (error) {
      console.error('Error adding score:', error);
      toast({
        title: "Error adding score",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deletePlayer = async (id: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete players.",
        variant: "destructive",
      });
      return;
    }

    try {
      await playerService.deletePlayerData(id);
      toast({
        title: "Player deleted",
        description: "Player and associated scores have been removed.",
      });
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        title: "Error deleting player",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteGame = async (id: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete games.",
        variant: "destructive",
      });
      return;
    }

    try {
      await gameService.deleteGameData(id);
      toast({
        title: "Game deleted",
        description: "Game and associated scores have been removed.",
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Error deleting game",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteScore = async (id: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete scores.",
        variant: "destructive",
      });
      return;
    }

    try {
      await scoreService.deleteScoreData(id);
      toast({
        title: "Score deleted",
        description: "Score has been removed.",
      });
    } catch (error) {
      console.error('Error deleting score:', error);
      toast({
        title: "Error deleting score",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePlayer = async (id: string, name: string, avatarUrl?: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to update players.",
        variant: "destructive",
      });
      return;
    }

    try {
      await playerService.updatePlayerData(id, name, avatarUrl);
      toast({
        title: "Player updated",
        description: `Player information has been updated.`,
      });
    } catch (error) {
      console.error('Error updating player:', error);
      toast({
        title: "Error updating player",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateScore = async (id: string, value: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to update scores.",
        variant: "destructive",
      });
      return;
    }

    try {
      await scoreService.updateScoreData(id, value);
      toast({
        title: "Score updated",
        description: `Score has been updated to ${value}.`,
      });
    } catch (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error updating score",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DataContext.Provider value={{
      players,
      games,
      scores,
      addPlayer,
      addGame,
      addScore,
      deletePlayer,
      deleteGame,
      deleteScore,
      updatePlayer,
      updateScore,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
