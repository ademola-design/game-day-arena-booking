
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

interface ProfileData {
  fullName: string;
  phone: string;
}

interface ProfileTabProps {
  user: User;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  updateProfile: () => Promise<void>;
}

const ProfileTab = ({ user, profileData, setProfileData, updateProfile }: ProfileTabProps) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              value={user.email || ""}
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed here</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={profileData.fullName}
              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="Enter your phone number"
            />
          </div>
          <Button onClick={updateProfile} className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
