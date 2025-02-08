
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Player {
  id: string;
  name: string;
  avatar?: string;
}

export interface Score {
  id: string;
  gameId: string;
  playerId: string;
  value: number;
}

export interface Game {
  id: string;
  name: string;
  date: string;
}

interface DataContextType {
  players: Player[];
  games: Game[];
  scores: Score[];
  addPlayer: (name: string) => void;
  addGame: (name: string) => void;
  addScore: (gameId: string, playerId: string, value: number) => void;
  deletePlayer: (id: string) => void;
  deleteGame: (id: string) => void;
  deleteScore: (id: string) => void;
  updatePlayer: (id: string, name: string) => void;
  updateScore: (id: string, value: number) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const { toast } = useToast();

  const addPlayer = (name: string) => {
    const newPlayer = { id: crypto.randomUUID(), name };
    setPlayers([...players, newPlayer]);
    toast({
      title: "Player added",
      description: `${name} has been added to the player list.`,
    });
  };

  const addGame = (name: string) => {
    const newGame = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
    };
    setGames([...games, newGame]);
    toast({
      title: "Game added",
      description: `${name} has been added to the games list.`,
    });
  };

  const addScore = (gameId: string, playerId: string, value: number) => {
    const newScore = {
      id: crypto.randomUUID(),
      gameId,
      playerId,
      value,
    };
    setScores([...scores, newScore]);
    toast({
      title: "Score added",
      description: `New score of ${value} has been recorded.`,
    });
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setScores(scores.filter(s => s.playerId !== id));
    toast({
      title: "Player deleted",
      description: "Player and associated scores have been removed.",
    });
  };

  const deleteGame = (id: string) => {
    setGames(games.filter(g => g.id !== id));
    setScores(scores.filter(s => s.gameId !== id));
    toast({
      title: "Game deleted",
      description: "Game and associated scores have been removed.",
    });
  };

  const deleteScore = (id: string) => {
    setScores(scores.filter(s => s.id !== id));
    toast({
      title: "Score deleted",
      description: "Score has been removed.",
    });
  };

  const updatePlayer = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
    toast({
      title: "Player updated",
      description: `Player name has been updated to ${name}.`,
    });
  };

  const updateScore = (id: string, value: number) => {
    setScores(scores.map(s => s.id === id ? { ...s, value } : s));
    toast({
      title: "Score updated",
      description: `Score has been updated to ${value}.`,
    });
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
