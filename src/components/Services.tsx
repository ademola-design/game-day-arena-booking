
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Basketball Court",
      description: "Professional basketball court with premium flooring and lighting",
      price: "₦2,500",
      duration: "per hour",
      features: ["Professional court", "Equipment included", "Changing rooms", "Shower facilities"]
    },
    {
      title: "Tennis Court",
      description: "Well-maintained tennis courts for singles and doubles play",
      price: "₦3,000",
      duration: "per hour",
      features: ["Indoor/Outdoor options", "Racket rental", "Ball machine access", "Court lighting"]
    },
    {
      title: "Swimming Pool",
      description: "Olympic-sized swimming pool with lane divisions",
      price: "₦1,500",
      duration: "per session",
      features: ["Olympic size", "Lane swimming", "Swimming lessons", "Lifeguard on duty"]
    },
    {
      title: "Football Field",
      description: "Full-size football field with professional grass",
      price: "₦15,000",
      duration: "per hour",
      features: ["Full-size field", "Goal posts", "Changing rooms", "Equipment storage"]
    },
    {
      title: "Badminton Court",
      description: "Indoor badminton courts with quality nets and flooring",
      price: "₦2,000",
      duration: "per hour",
      features: ["Quality nets", "Wooden flooring", "Racket rental", "Shuttlecocks included"]
    },
    {
      title: "Fitness Center",
      description: "Modern gym with cardio and strength training equipment",
      price: "₦3,500",
      duration: "per day",
      features: ["Modern equipment", "Personal training", "Group classes", "Locker access"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our wide range of sports facilities and activities. 
            All bookings include access to premium amenities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-blue-600 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-blue-100">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-600">{service.price}</span>
                    <span className="text-gray-500">{service.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate('/booking', { state: { selectedService: service.title } })}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
