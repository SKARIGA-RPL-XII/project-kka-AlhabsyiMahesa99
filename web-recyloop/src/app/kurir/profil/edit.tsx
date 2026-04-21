"use client";

import { ProfileEditForm } from "./components/ProfileEditForm";
import { useEditProfile } from "./hooks/useEditProfile";

export default function CourierSettingProfile() {
  const { loading, isLocating, formData, previewUrl, setFormData, getLocation, handleSave, handleFileChange } =
    useEditProfile();

  return (
    <ProfileEditForm
      loading={loading}
      isLocating={isLocating}
      formData={formData}
      previewUrl={previewUrl}
      onChangeFormData={setFormData}
      onGetLocation={getLocation}
      onSave={handleSave}
      onFileChange={handleFileChange}
    />
  );
}
