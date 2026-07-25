export type UserRole = "student" | "faculty" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  floors_count: number;
  description?: string;
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number;
  name: string;
  svg_url: string;
}
