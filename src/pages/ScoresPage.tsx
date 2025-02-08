import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ScoresPage = () => {
  const { games, players, scores, addGame, addScore, deleteGame, deleteScore, updateScore } = useData();
  const { isAdmin } = useAuth();
  const [newGameName, setNewGameName] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [newScore, setNewScore] = useState({ playerId: '', value: '' });

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGameName.trim()) {
      addGame(newGameName.trim());
      setNewGameName('');
    }
  };

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGame && newScore.playerId && newScore.value) {
      addScore(selectedGame, newScore.playerId, Number(newScore.value));
      setNewScore({ playerId: '', value: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scores</h1>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Game</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGame} className="space-y-4">
                <Input
                  placeholder="Game name"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                />
                <Button type="submit">Add Game</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {games.map((game) => (
          <Card key={game.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {game.name}
              </CardTitle>
              {isAdmin && (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Score
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Score for {game.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddScore} className="space-y-4">
                        <Select
                          value={newScore.playerId}
                          onValueChange={(value) => setNewScore({ ...newScore, playerId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select player" />
                          </SelectTrigger>
                          <SelectContent>
                            {players.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Score"
                          value={newScore.value}
                          onChange={(e) => setNewScore({ ...newScore, value: e.target.value })}
                        />
                        <Button type="submit" onClick={() => setSelectedGame(game.id)}>
                          Add Score
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGame(game.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scores
                  .filter((score) => score.game_id === game.id)
                  .map((score) => {
                    const player = players.find((p) => p.id === score.player_id);
                    return (
                      <div
                        key={score.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary"
                      >
                        <span>{player?.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{score.value}</span>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteScore(score.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScoresPage;
