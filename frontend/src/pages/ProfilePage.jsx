import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Edit, Mail, Phone, Save, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    phoneNo: authUser.phoneNo || "",
    profilePic: authUser.profilePic || "",
    email: authUser.email || "",
    fullName: authUser.fullName || "",
  })
  const [isUpdateProfileDetails, setIsUpdateProfileDetails] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setFormData({ ...formData, profilePic: base64Image });
      setIsUpdateProfileDetails(true);
    };
  };


  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 relative">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {isUpdateProfileDetails ? <button
            className="bg-green-500 text-white px-2 py-1 rounded-lg absolute top-0 right-10"
            onClick={async () => {
              await updateProfile(formData);
               setIsUpdateProfileDetails(false);
            }}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? "Updating..." : <span className="flex align-middle justify-center gap-2 "> <Save/> Update</span>}
          </button> :
            <span className="absolute top-0 right-10 cursor-pointer" title="Edit Profile" onClick={() => setIsUpdateProfileDetails(true)}><Edit /></span>
          }
          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={formData.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {!isUpdateProfileDetails ? <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p> :
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              }
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              {!isUpdateProfileDetails ? <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p> :
                <input
                  type="text"
                  placeholder="Enter your email ID"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              }
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </div>
              {!isUpdateProfileDetails ? <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.phoneNo}</p> :
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNo: e.target.value }))}
                />
              }
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
