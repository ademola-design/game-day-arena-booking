
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    service: location.state?.selectedService || "",
    date: undefined,
    time: "",
    duration: "1",
    specialRequests: "",
    membershipType: location.state?.selectedMembership || ""
  });

  // Load Paystack script
  useEffect(() => {
    const loadPaystackScript = () => {
      if (document.querySelector('script[src*="paystack"]')) {
        setPaystackLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        console.log('Paystack script loaded successfully');
        setPaystackLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        toast({
          title: "Script Loading Error",
          description: "Failed to load payment processor. Please refresh the page.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, [toast]);

  // Update email when user is loaded
  useEffect(() => {
    if (user && !bookingData.email) {
      setBookingData(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user, bookingData.email]);

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

  const saveBookingToDatabase = async (paymentReference: string) => {
    if (!user) {
      console.error('No user found when trying to save booking');
      throw new Error('User not authenticated');
    }

    try {
      const bookingRecord = {
        user_id: user.id,
        service_type: bookingData.membershipType ? 'membership' : 'facility',
        service_name: bookingData.service || bookingData.membershipType || '',
        booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        booking_time: bookingData.time || '00:00',
        duration: bookingData.membershipType ? '30 days' : `${bookingData.duration} hour(s)`,
        amount: calculateTotal(),
        payment_reference: paymentReference,
        payment_status: 'completed',
        booking_status: 'confirmed',
        special_requests: bookingData.specialRequests || null
      };

      console.log('Saving booking to database:', bookingRecord);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingRecord])
        .select()
        .single();

      if (error) {
        console.error('Error saving booking:', error);
        throw error;
      }

      console.log('Booking saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in saveBookingToDatabase:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful, reference:', response.reference);
    
    try {
      const savedBooking = await saveBookingToDatabase(response.reference);
      
      if (savedBooking) {
        toast({
          title: "Booking Confirmed!",
          description: "Your booking has been saved successfully. Redirecting to receipt...",
        });
        
        // Navigate to receipt with booking data including special requests
        const receiptData = {
          bookingId: savedBooking.id,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          service: bookingData.service,
          membershipType: bookingData.membershipType,
          date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          time: bookingData.time,
          duration: bookingData.membershipType ? '30 days' : `${bookingData.duration} hour(s)`,
          total: calculateTotal(),
          specialRequests: bookingData.specialRequests
        };

        navigate('/receipt', {
          state: {
            paymentReference: response.reference,
            bookingData: receiptData
          }
        });
      }
    } catch (error) {
      console.error('Error saving booking after payment:', error);
      toast({
        title: "Payment Successful",
        description: "Payment completed but there was an issue saving your booking. Please contact support.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    toast({
      title: "Payment Cancelled",
      description: "Your payment was cancelled. Please try again.",
      variant: "destructive"
    });
    setIsLoading(false);
  };

  const initializePayment = () => {
    if (!paystackLoaded) {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load and try again.",
        variant: "destructive"
      });
      return;
    }

    if (!(window as any).PaystackPop) {
      toast({
        title: "Payment System Error",
        description: "Payment system not available. Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }

    const total = calculateTotal();
    console.log('Initializing payment for amount:', total);

    try {
      const paystackHandler = (window as any).PaystackPop.setup({
        key: 'pk_test_4f155bc2248c217e5cacf4965e3686d0b3bb4229',
        email: bookingData.email,
        amount: total * 100, // Convert to kobo
        currency: 'NGN',
        ref: `BK-${Date.now()}`,
        callback: function(response: any) {
          console.log('Payment callback received:', response);
          handlePaymentSuccess(response);
        },
        onClose: function() {
          console.log('Payment popup closed');
          handlePaymentClose();
        }
      });

      console.log('Opening Paystack payment popup');
      paystackHandler.openIframe();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
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
    console.log('Form submitted, initializing payment...');
    initializePayment();
  };

  // Redirect to auth if not authenticated and not loading
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to make a booking.</p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while auth is loading
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
                  disabled={isLoading || calculateTotal() === 0 || !paystackLoaded}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Processing..." : !paystackLoaded ? "Loading Payment..." : `Pay ₦${calculateTotal().toLocaleString()}`}
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
