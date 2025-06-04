
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentReference, bookingData } = location.state || {};

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">No booking data found.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your booking has been confirmed. Please present this receipt at the venue.</p>
        </div>

        <Card className="shadow-lg border-0 mb-8" id="receipt">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
            <CardTitle className="text-2xl">SportZone Receipt</CardTitle>
            <CardDescription className="text-green-100">
              Booking Confirmation & Payment Receipt
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">Booking ID</h3>
                  <p className="text-blue-600 font-mono">{bookingData.bookingId}</p>
                </div>
                <Badge variant="default" className="bg-green-600">
                  CONFIRMED
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {bookingData.firstName} {bookingData.lastName}</p>
                    <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                    <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Payment Reference:</span> {paymentReference}</p>
                    <p><span className="font-medium">Payment Date:</span> {format(new Date(), "PPP")}</p>
                    <p><span className="font-medium">Amount Paid:</span> ₦{bookingData.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  {bookingData.service && (
                    <>
                      <p><span className="font-medium">Service:</span> {bookingData.service}</p>
                      {bookingData.date && <p><span className="font-medium">Date:</span> {format(new Date(bookingData.date), "PPP")}</p>}
                      {bookingData.time && <p><span className="font-medium">Time:</span> {bookingData.time}</p>}
                      {bookingData.duration && <p><span className="font-medium">Duration:</span> {bookingData.duration} hour(s)</p>}
                    </>
                  )}
                  
                  {bookingData.membershipType && (
                    <p><span className="font-medium">Membership:</span> {bookingData.membershipType} Plan</p>
                  )}
                  
                  {bookingData.specialRequests && (
                    <p><span className="font-medium">Special Requests:</span> {bookingData.specialRequests}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Please arrive 15 minutes before your scheduled time</li>
                  <li>• Bring a valid ID and this receipt for verification</li>
                  <li>• Cancellations must be made at least 24 hours in advance</li>
                  <li>• Contact us at +234 901 234 5678 for any inquiries</li>
                </ul>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-gray-600 text-sm">
                  SportZone - 123 Sports Avenue, Victoria Island, Lagos<br />
                  Thank you for choosing SportZone!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handlePrint} variant="outline">
            Print Receipt
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
          <Button onClick={() => navigate('/')} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
