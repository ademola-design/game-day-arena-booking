
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface BookingTableProps {
  bookings: Booking[];
  getEnrichedBookingData: (booking: Booking) => any;
}

const BookingTable = ({ bookings, getEnrichedBookingData }: BookingTableProps) => {
  const navigate = useNavigate();

  const handleViewReceipt = (booking: Booking) => {
    const receiptData = getEnrichedBookingData(booking);

    navigate('/receipt', {
      state: {
        paymentReference: booking.payment_reference,
        bookingData: receiptData
      }
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">{booking.service_name}</TableCell>
            <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
            <TableCell>{booking.booking_time}</TableCell>
            <TableCell>{booking.duration}</TableCell>
            <TableCell>₦{booking.amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={booking.booking_status === "confirmed" ? "default" : "secondary"} 
                    className={booking.booking_status === "confirmed" ? "bg-green-600" : ""}>
                {booking.booking_status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => handleViewReceipt(booking)}>
                Receipt
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;
