
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

interface DashboardHeaderProps {
  userProfile: UserProfile | null;
}

const DashboardHeader = ({ userProfile }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was an error signing you out.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">
          Welcome back, {userProfile?.full_name || user?.email}!
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => navigate('/')} variant="outline">
          ← Back to Home
        </Button>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
