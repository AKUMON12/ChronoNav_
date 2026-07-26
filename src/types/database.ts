/**
 * ChronoNav Database TypeScript Definitions
 * Aligned with Capstone ERD Schema (20260101000000_init_schema.sql)
 */

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string; // UUID PK
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface RoomCoordinates {
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
  buildingCode?: string;
  nodes?: Array<{ id: string; x: number; y: number }>;
}

export interface Room {
  id: string; // UUID PK
  building_name: string;
  room_number: string;
  floor: number;
  coordinates: RoomCoordinates;
}

export interface Schedule {
  id: string; // UUID PK
  user_id: string; // FK -> User
  course_name: string;
  day: string;
  start_time: string;
  end_time: string;
  room_id?: string | null; // FK -> Room
  created_at?: string;
}

export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface OCRLog {
  id: string; // UUID PK
  user_id: string; // FK -> User
  image_path: string;
  extracted_text?: string | null;
  status: OCRStatus | string;
  upload_time: string;
}

export interface Reminder {
  id: string; // UUID PK
  schedule_id: string; // FK -> Schedule
  reminder_time: string;
  message: string;
  created_at?: string;
}

export interface Notification {
  id: string; // UUID PK
  user_id: string; // FK -> User
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface PathStepDetails {
  distance_meters?: number;
  estimated_minutes?: number;
  waypoints?: Array<{ room_id?: string; node_id?: string; instruction?: string }>;
}

export interface SavedPath {
  id: string; // UUID PK
  user_id: string; // FK -> User
  origin_room_id?: string | null; // FK -> Room
  destination_room_id?: string | null; // FK -> Room
  path_details: PathStepDetails;
  created_at?: string;
}

/**
 * Database Schema mapping for Supabase Client generics
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      rooms: {
        Row: Room;
        Insert: Omit<Room, 'id'> & { id?: string };
        Update: Partial<Omit<Room, 'id'>>;
      };
      schedules: {
        Row: Schedule;
        Insert: Omit<Schedule, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Schedule, 'id'>>;
      };
      ocr_logs: {
        Row: OCRLog;
        Insert: Omit<OCRLog, 'id' | 'upload_time'> & { id?: string; upload_time?: string };
        Update: Partial<Omit<OCRLog, 'id'>>;
      };
      reminders: {
        Row: Reminder;
        Insert: Omit<Reminder, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Reminder, 'id'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Notification, 'id'>>;
      };
      saved_paths: {
        Row: SavedPath;
        Insert: Omit<SavedPath, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<SavedPath, 'id'>>;
      };
    };
  };
}
