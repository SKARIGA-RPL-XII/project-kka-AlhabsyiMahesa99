export function getProfileAvatarUrl(name: string, avatarUrl?: string | null) {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Kurir")}&background=2563eb&color=fff`;
}
