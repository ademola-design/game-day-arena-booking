
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface BookingCardProps {
  booking: Booking;
  getEnrichedBookingData: (booking: Booking) => any;
}

const BookingCard = ({ booking, getEnrichedBookingData }: BookingCardProps) => {
  const navigate = useNavigate();

  const handleViewReceipt = () => {
    const receiptData = getEnrichedBookingData(booking);

    navigate('/receipt', {
      state: {
        paymentReference: booking.payment_reference,
        bookingData: receiptData
      }
    });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{booking.service_name}</CardTitle>
          <Badge variant={booking.booking_status === "confirmed" ? "default" : "secondary"} 
                className={booking.booking_status === "confirmed" ? "bg-green-600" : ""}>
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
            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>{booking.booking_time} ({booking.duration})</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="font-semibold">Amount: ₦{booking.amount.toLocaleString()}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewReceipt}
            >
              View Receipt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
