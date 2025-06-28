
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const {
    user,
    loading,
    userProfile,
    userBookings,
    profileData,
    setProfileData,
    isLoadingData,
    updateProfile,
    getEnrichedBookingData
  } = useDashboardData();

  if (loading || isLoadingData) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader userProfile={userProfile} />
        <DashboardContent 
          user={user}
          userBookings={userBookings}
          profileData={profileData}
          setProfileData={setProfileData}
          updateProfile={updateProfile}
          getEnrichedBookingData={getEnrichedBookingData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
