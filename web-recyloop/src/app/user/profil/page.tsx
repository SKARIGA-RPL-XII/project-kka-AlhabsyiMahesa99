"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import SettingProfil from "./edit";
import ProfileView from "./components/ProfileView";
import { useUserProfile } from "./hooks/useUserProfile";

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { loading, profile, activities } = useUserProfile();

  if (isEditing) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setIsEditing(false)}
          className="cursor-pointer text-sm font-bold text-gray-500 hover:text-[#299E63] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Profil
        </button>
        <SettingProfil />
      </div>
    );
  }

  return <ProfileView loading={loading} profile={profile} activities={activities} onEdit={() => setIsEditing(true)} />;
}