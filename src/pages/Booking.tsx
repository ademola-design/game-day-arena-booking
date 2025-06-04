
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: Date | undefined;
  time: string;
  duration: string;
  specialRequests: string;
  membershipType?: string;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: location.state?.selectedService || "",
    date: undefined,
    time: "",
    duration: "1",
    specialRequests: "",
    membershipType: location.state?.selectedMembership || ""
  });

  const services = [
    { name: "Basketball Court", price: 2500 },
    { name: "Tennis Court", price: 3000 },
    { name: "Swimming Pool", price: 1500 },
    { name: "Football Field", price: 15000 },
    { name: "Badminton Court", price: 2000 },
    { name: "Fitness Center", price: 3500 }
  ];

  const memberships = [
    { name: "Basic", price: 15000 },
    { name: "Premium", price: 25000 },
    { name: "Elite", price: 40000 }
  ];

  const timeSlots = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
  ];

  const calculateTotal = () => {
    let total = 0;
    
    if (bookingData.membershipType) {
      const membership = memberships.find(m => m.name === bookingData.membershipType);
      if (membership) total += membership.price;
    }
    
    if (bookingData.service) {
      const service = services.find(s => s.name === bookingData.service);
      if (service) {
        total += service.price * parseInt(bookingData.duration);
      }
    }
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.service && !bookingData.membershipType) {
      toast({
        title: "No Service Selected",
        description: "Please select a service or membership.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Initialize Paystack payment
      const total = calculateTotal();
      
      // Store booking data in localStorage for after payment
      localStorage.setItem('pendingBooking', JSON.stringify({
        ...bookingData,
        date: selectedDate,
        total: total,
        bookingId: `BK-${Date.now()}`
      }));

      // Initialize Paystack payment
      const paystackHandler = (window as any).PaystackPop.setup({
        key: 'pk_test_your-paystack-public-key', // Replace with your Paystack public key
        email: bookingData.email,
        amount: total * 100, // Amount in kobo
        currency: 'NGN',
        ref: `BK-${Date.now()}`,
        callback: function(response: any) {
          // Payment successful
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed. Redirecting to receipt...",
          });
          
          // Redirect to receipt page
          setTimeout(() => {
            navigate('/receipt', { 
              state: { 
                paymentReference: response.reference,
                bookingData: {
                  ...bookingData,
                  date: selectedDate,
                  total: total,
                  bookingId: `BK-${Date.now()}`
                }
              }
            });
          }, 2000);
        },
        onClose: function() {
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled. Please try again.",
            variant: "destructive"
          });
        }
      });

      paystackHandler.openIframe();
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Session</h1>
          <p className="text-xl text-gray-600">Complete your booking and payment details below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                <CardTitle>Booking Details</CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in your information and select your preferred service
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.firstName}
                        onChange={(e) => setBookingData({...bookingData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.lastName}
                        onChange={(e) => setBookingData({...bookingData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {!bookingData.membershipType && (
                    <>
                      <div>
                        <Label htmlFor="service">Select Service</Label>
                        <Select value={bookingData.service} onValueChange={(value) => setBookingData({...bookingData, service: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.name} value={service.name}>
                                {service.name} - ₦{service.price.toLocaleString()}/hour
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Select value={bookingData.time} onValueChange={(value) => setBookingData({...bookingData, time: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration">Duration (hours)</Label>
                          <Select value={bookingData.duration} onValueChange={(value) => setBookingData({...bookingData, duration: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="3">3 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {!bookingData.service && (
                    <div>
                      <Label htmlFor="membership">Select Membership</Label>
                      <Select value={bookingData.membershipType} onValueChange={(value) => setBookingData({...bookingData, membershipType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a membership plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {memberships.map((membership) => (
                            <SelectItem key={membership.name} value={membership.name}>
                              {membership.name} - ₦{membership.price.toLocaleString()}/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {bookingData.service && (
                    <div className="flex justify-between">
                      <span>{bookingData.service}</span>
                      <span>₦{(services.find(s => s.name === bookingData.service)?.price || 0).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {bookingData.membershipType && (
                    <div className="flex justify-between">
                      <span>{bookingData.membershipType} Membership</span>
                      <span>₦{(memberships.find(m => m.name === bookingData.membershipType)?.price || 0).toLocaleString()}</span>
                    </div>
                  )}

                  {bookingData.service && bookingData.duration && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Duration: {bookingData.duration} hour(s)</span>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Date: {format(selectedDate, "PPP")}</span>
                    </div>
                  )}

                  {bookingData.time && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Time: {bookingData.time}</span>
                    </div>
                  )}

                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading || calculateTotal() === 0}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Processing..." : `Pay ₦${calculateTotal().toLocaleString()}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
