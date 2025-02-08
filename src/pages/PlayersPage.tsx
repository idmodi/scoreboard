
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PlayersPage = () => {
  const { players, addPlayer, deletePlayer, updatePlayer } = useData();
  const { isAdmin } = useAuth();
  const [newPlayerData, setNewPlayerData] = useState({ name: '', avatarUrl: '' });
  const [editingPlayer, setEditingPlayer] = useState<{ id: string; name: string; avatarUrl?: string | null } | null>(null);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerData.name.trim()) {
      await addPlayer(newPlayerData.name.trim(), newPlayerData.avatarUrl.trim() || undefined);
      setNewPlayerData({ name: '', avatarUrl: '' });
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer && editingPlayer.name.trim()) {
      await updatePlayer(editingPlayer.id, editingPlayer.name.trim(), editingPlayer.avatarUrl || undefined);
      setEditingPlayer(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Players</h1>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPlayer} className="space-y-4">
                <Input
                  placeholder="Player name"
                  value={newPlayerData.name}
                  onChange={(e) => setNewPlayerData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Avatar URL (optional)"
                  value={newPlayerData.avatarUrl}
                  onChange={(e) => setNewPlayerData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
                <Button type="submit">Add Player</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {players.map((player) => (
          <Card key={player.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={player.avatar_url || undefined} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-base font-medium">
                  {player.name}
                </CardTitle>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Player</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdatePlayer} className="space-y-4">
                        <Input
                          placeholder="Player name"
                          value={editingPlayer?.name || ''}
                          onChange={(e) => setEditingPlayer(prev => prev ? { ...prev, name: e.target.value } : null)}
                        />
                        <Input
                          placeholder="Avatar URL (optional)"
                          value={editingPlayer?.avatarUrl || ''}
                          onChange={(e) => setEditingPlayer(prev => prev ? { ...prev, avatarUrl: e.target.value } : null)}
                        />
                        <Button type="submit">Update Player</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePlayer(player.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total Games: {/* This will be implemented later */}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;
