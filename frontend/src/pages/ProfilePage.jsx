import React, { useState } from 'react'
import { CalendarDays, Camera, Mail, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg , setSelectedImg] = useState(null);
  const joinedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString()
    : "-";
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const render = new FileReader();
    render.readAsDataURL(file);

    render.onload = async () => {
      const base64Image = render.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic: base64Image});
    };
  };
  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto w-sm">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body w-sm gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-base-content/70">Your account information</p>
            </div>

            <div className='w-full text-center'>
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 h-24 w-24 rounded-full ring-2 ring-offset-2">
                  <img
                    src={selectedImg || authUser?.profilePic || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"}
                    alt="Profile"
                  />
                  <label htmlFor="avatar-upload" className='absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200'>
                    <Camera className='size-5 text-base-200'/>
                    <input
                      type="file"
                      id="avatar-upload"
                      className='hidden'
                      accept="image/*"
                      disabled={isUpdatingProfile}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
                <p className='text-sm text-zinc-400 mt-4'>
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
            </div>

            <div className="grid gap-4 ">
              <label className="form-control">
                <span className="label-text mb-2 flex items-center gap-2 font-medium">
                  <User className="h-4 w-4" />
                  Full Name
                </span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={authUser?.fullName || ""}
                  readOnly
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-2 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={authUser?.email || ""}
                  readOnly
                />
              </label>
            </div>

            <div className="rounded-box border border-base-300 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base-content/70">
                  <CalendarDays className="h-4 w-4" />
                  Member since
                </div>
                <span className="font-medium">{joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage