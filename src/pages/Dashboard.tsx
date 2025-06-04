
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Ticket } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    // For now, we'll simulate some bookings
    const sampleBookings = [
      {
        id: "BK-001",
        service: "Basketball Court",
        date: new Date(2024, 6, 15),
        time: "2:00 PM",
        duration: "2 hours",
        status: "Confirmed",
        amount: 5000
      },
      {
        id: "BK-002",
        service: "Swimming Pool",
        date: new Date(2024, 6, 20),
        time: "10:00 AM", 
        duration: "1 hour",
        status: "Confirmed",
        amount: 1500
      }
    ];
    setUserBookings(sampleBookings);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-xl text-gray-600">Manage your bookings and account</p>
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
                        <CardTitle className="text-lg">{booking.service}</CardTitle>
                        <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"} className="bg-green-600">
                          {booking.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-blue-100">
                        Booking ID: {booking.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>{format(booking.date, "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>{booking.time} ({booking.duration})</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
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
