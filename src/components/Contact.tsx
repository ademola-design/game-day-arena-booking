
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for bookings, inquiries, or any questions about our facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-blue-600 to-orange-500 text-white rounded-t-lg">
              <CardTitle>Visit Us</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                123 Sports Avenue<br />
                Victoria Island, Lagos<br />
                Nigeria
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-orange-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle>Call Us</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                Phone: +234 901 234 5678<br />
                WhatsApp: +234 901 234 5678<br />
                Open: 6:00 AM - 10:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-blue-600 to-orange-500 text-white rounded-t-lg">
              <CardTitle>Email Us</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                info@sportzone.ng<br />
                bookings@sportzone.ng<br />
                support@sportzone.ng
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <div className="bg-gray-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <p className="font-semibold text-gray-700">Monday - Friday</p>
                <p className="text-gray-600">6:00 AM - 10:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Saturday - Sunday</p>
                <p className="text-gray-600">7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
