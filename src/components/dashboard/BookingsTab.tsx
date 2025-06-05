
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingCard from "./BookingCard";
import BookingTable from "./BookingTable";

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

interface BookingsTabProps {
  userBookings: Booking[];
  isLoading: boolean;
}

const BookingsTab = ({ userBookings, isLoading }: BookingsTabProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </CardContent>
      </Card>
    );
  }

  if (userBookings.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <BookingTable bookings={userBookings} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {userBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </>
  );
};

export default BookingsTab;
