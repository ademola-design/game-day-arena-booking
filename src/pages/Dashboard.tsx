
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Ticket } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchUserProfile();
      fetchUserBookings();
    }
  }, [user, loading, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
      setProfileData({
        fullName: data.full_name || "",
        phone: data.phone || ""
      });
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setUserBookings(data || []);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: profileData.fullName,
        phone: profileData.phone,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      fetchUserProfile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-xl text-gray-600">Welcome back, {userProfile?.full_name || user.email}!</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back to Home
          </Button>
        </div>

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

            {userBookings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">Make your first booking to get started!</p>
                  <Button onClick={() => navigate('/booking')}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBookings.map((booking) => (
                  <Card key={booking.id} className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{booking.service_name}</CardTitle>
                        <Badge variant={booking.booking_status === "confirmed" ? "default" : "secondary"} className="bg-green-600">
                          {booking.booking_status}
                        </Badge>
                      </div>
                      <CardDescription className="text-blue-100">
                        Booking ID: {booking.id.slice(0, 8)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>{format(new Date(booking.booking_date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>{booking.booking_time} ({booking.duration})</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="font-semibold">Amount: ₦{booking.amount.toLocaleString()}</span>
                          <Button variant="outline" size="sm">
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="membership" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Membership Status</h2>
            
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
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      value={user.email || ""}
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <Button onClick={updateProfile} className="bg-blue-600 hover:bg-blue-700">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
