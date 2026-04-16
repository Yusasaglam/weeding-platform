export type UserRole = 'admin' | 'couple'
export type WeddingStatus = 'draft' | 'active' | 'delivered' | 'archived'
export type AlbumVisibility = 'private' | 'couple' | 'guest'
export type MediaFileType = 'image' | 'video'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

export interface Wedding {
  id: string
  title: string
  bride_name: string
  groom_name: string
  event_date: string | null
  venue: string
  status: WeddingStatus
  cover_url: string | null
  created_by: string
  created_at: string
}

export interface WeddingCouple {
  id: string
  wedding_id: string
  user_id: string
  created_at: string
}

export interface Album {
  id: string
  wedding_id: string
  title: string
  description: string
  visibility: AlbumVisibility
  sort_order: number
  created_at: string
}

export interface MediaFile {
  id: string
  wedding_id: string
  album_id: string | null
  storage_path: string
  file_name: string
  file_type: MediaFileType
  mime_type: string
  file_size: number
  width: number | null
  height: number | null
  duration_seconds: number | null
  uploaded_by: string | null
  created_at: string
}

export interface GuestToken {
  id: string
  token: string
  wedding_id: string
  album_id: string | null
  label: string
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  media_file_id: string
  created_at: string
}
