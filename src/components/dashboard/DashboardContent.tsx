
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsTab from "./BookingsTab";
import MembershipTab from "./MembershipTab";
import ProfileTab from "./ProfileTab";
import { User } from '@supabase/supabase-js';

interface Booking {
  id: string;
  service_type: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration: string;
  amount: number;
  payment_reference: string | null;
  payment_status: string;
  booking_status: string;
  created_at: string;
}

interface ProfileData {
  fullName: string;
  phone: string;
}

interface DashboardContentProps {
  user: User;
  userBookings: Booking[];
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  updateProfile: () => Promise<void>;
}

const DashboardContent = ({ 
  user, 
  userBookings, 
  profileData, 
  setProfileData, 
  updateProfile 
}: DashboardContentProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="bookings" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <Button onClick={() => navigate('/booking')} className="bg-blue-600 hover:bg-blue-700">
            New Booking
          </Button>
        </div>
        <BookingsTab userBookings={userBookings} isLoading={false} />
      </TabsContent>

      <TabsContent value="membership" className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Membership Status</h2>
        <MembershipTab />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <ProfileTab 
          user={user}
          profileData={profileData}
          setProfileData={setProfileData}
          updateProfile={updateProfile}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
