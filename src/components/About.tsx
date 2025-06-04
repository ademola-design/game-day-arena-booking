
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const About = () => {
  const facilities = [
    {
      title: "Swimming Pool",
      description: "Olympic-sized pool with professional training lanes"
    },
    {
      title: "Basketball Court",
      description: "Full-size courts with professional lighting and sound"
    },
    {
      title: "Tennis Courts", 
      description: "Multiple indoor and outdoor courts with night lighting"
    },
    {
      title: "Fitness Center",
      description: "State-of-the-art equipment and personal training services"
    },
    {
      title: "Football Field",
      description: "Professional-grade field for matches and training"
    },
    {
      title: "Badminton Courts",
      description: "Multiple courts for recreational and competitive play"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SportZone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Since 2010, SportZone has been the premier sports and recreation center, 
            offering world-class facilities and programs for athletes of all levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((facility, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">{facility.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {facility.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
          <p className="text-lg opacity-90 max-w-4xl mx-auto">
            To provide a safe, inclusive, and inspiring environment where individuals 
            and communities can pursue their passion for sports, achieve their fitness goals, 
            and build lasting connections through the power of athletic excellence.
          </p>
        </div>
      </div>
    </section>
  );
};
