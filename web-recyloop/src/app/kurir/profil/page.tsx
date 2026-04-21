"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import SettingProfil from "./edit";
import { ProfileView } from "./components/ProfileView";
import { useProfile } from "./hooks/useProfile";

export default function CourierProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { loading, profile, joinDate } = useProfile(isEditing);

  if (isEditing) {
    return (
      <div className="space-y-6 font-poppins">
        <button
          onClick={() => setIsEditing(false)}
          className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Kembali ke Profil
        </button>
        <SettingProfil />
      </div>
    );
  }

  return <ProfileView loading={loading} profile={profile} joinDate={joinDate} onEdit={() => setIsEditing(true)} />;
}
