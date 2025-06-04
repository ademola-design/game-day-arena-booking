
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, User, Ticket } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Events } from "@/components/Events";
import { Membership } from "@/components/Membership";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Events />
      <Membership />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
