
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

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

interface ProfileData {
  fullName: string;
  phone: string;
}

export const useDashboardData = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    phone: ""
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (user) {
      console.log('User found, fetching data for:', user.email);
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    setIsLoadingData(true);
    try {
      await Promise.all([fetchUserProfile(), fetchUserBookings()]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Profile data:', data);
        setUserProfile(data);
        setProfileData({
          fullName: data?.full_name || "",
          phone: data?.phone || ""
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching bookings for user:', user.id);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error loading bookings",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Bookings data:', data);
        setUserBookings(data || []);
      }
    } catch (error) {
      console.error('Error in fetchUserBookings:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.fullName,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    loading,
    userProfile,
    userBookings,
    profileData,
    setProfileData,
    isLoadingData,
    updateProfile,
    fetchUserData
  };
};
