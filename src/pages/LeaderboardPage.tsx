
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LeaderboardPage = () => {
  const { players, scores } = useData();

  const calculateAverageScore = (playerId: string) => {
    const playerScores = scores.filter((score) => score.player_id === playerId);
    if (playerScores.length === 0) return 0;
    const total = playerScores.reduce((sum, score) => sum + score.value, 0);
    return total / playerScores.length;
  };

  const playerRankings = players
    .map((player) => ({
      ...player,
      averageScore: calculateAverageScore(player.id),
    }))
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      <div className="space-y-4">
        {playerRankings.map((player, index) => (
          <Card key={player.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                <CardTitle className="text-base font-medium">
                  {player.name}
                </CardTitle>
              </div>
              <span className="text-lg font-semibold">
                {player.averageScore.toFixed(1)}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total Games: {scores.filter((score) => score.player_id === player.id).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
