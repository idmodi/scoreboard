
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import PlayersPage from "./pages/PlayersPage";
import ScoresPage from "./pages/ScoresPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/players" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/scores" element={<ScoresPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster />
            <Sonner />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
