
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const Membership = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "₦15,000",
      period: "per month",
      description: "Perfect for casual sports enthusiasts",
      features: [
        "Access to fitness center",
        "Swimming pool access",
        "Basic equipment rental",
        "Locker room access",
        "1 guest pass per month"
      ],
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Premium",
      price: "₦25,000", 
      period: "per month",
      description: "Great for regular players and fitness enthusiasts",
      features: [
        "All Basic features",
        "Court booking priority",
        "Free equipment rental",
        "Group fitness classes",
        "Personal training discount",
        "3 guest passes per month",
        "Event registration discount"
      ],
      popular: true,
      color: "from-blue-600 to-orange-500"
    },
    {
      name: "Elite",
      price: "₦40,000",
      period: "per month", 
      description: "Ultimate package for serious athletes",
      features: [
        "All Premium features",
        "Unlimited court access",
        "Personal training sessions",
        "Nutrition consultation",
        "Private locker",
        "Unlimited guest passes",
        "Free tournament entry",
        "VIP parking access"
      ],
      popular: false,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="membership" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Membership Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect membership plan that fits your lifestyle and sporting needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden ${plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <CardHeader className={`bg-gradient-to-br ${plan.color} text-white ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg opacity-75">/{plan.period}</span>
                </div>
                <CardDescription className="text-center text-white/90">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => navigate('/booking', { state: { selectedMembership: plan.name } })}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'}`}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Membership?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Access to facilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
                <div className="text-gray-600">Classes per week</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Satisfaction guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
