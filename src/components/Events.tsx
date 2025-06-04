
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

export const Events = () => {
  const upcomingEvents = [
    {
      title: "Summer Basketball Tournament",
      date: "July 15-17, 2024",
      time: "9:00 AM - 6:00 PM",
      participants: "64 teams",
      status: "Registration Open",
      description: "Annual basketball championship with prizes worth ₦500,000",
      registrationFee: "₦25,000 per team"
    },
    {
      title: "Swimming Championship",
      date: "August 5, 2024",
      time: "10:00 AM - 4:00 PM",
      participants: "Open to all",
      status: "Registration Open",
      description: "Individual and relay swimming competitions",
      registrationFee: "₦5,000 per person"
    },
    {
      title: "Tennis Open Tournament",
      date: "August 20-22, 2024",
      time: "8:00 AM - 7:00 PM",
      participants: "Singles & Doubles",
      status: "Coming Soon",
      description: "Professional tennis tournament with international standards",
      registrationFee: "₦15,000 per person"
    }
  ];

  const pastEvents = [
    {
      title: "Spring Football League",
      date: "March 2024",
      description: "16 teams competed in an exciting month-long tournament"
    },
    {
      title: "Badminton Championship",
      date: "February 2024", 
      description: "Over 100 participants in singles and doubles categories"
    }
  ];

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Events & Tournaments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our exciting tournaments and events. Compete with the best and win amazing prizes!
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant={event.status === "Registration Open" ? "default" : "secondary"} className="bg-white text-orange-600">
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-orange-100">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{event.participants}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-lg font-semibold text-blue-600">{event.registrationFee}</span>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={event.status !== "Registration Open"}
                  >
                    {event.status === "Registration Open" ? "Register Now" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="text-orange-600 font-semibold">
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
