
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MembershipTab = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
        <CardTitle>Current Membership</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Membership</h3>
          <p className="text-gray-600 mb-4">Upgrade to a membership plan for exclusive benefits and savings!</p>
          <Button onClick={() => navigate('/booking')} className="bg-orange-500 hover:bg-orange-600">
            Choose Membership Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipTab;
