export type CampusFloorId = 1 | "M" | 2 | 3 | 4 | 5 | 6 | 7;

export interface NavNode {
  id: string;
  floorId: string | number;
  x: number;
  y: number;
  label?: string;
  type: "room" | "corridor" | "elevator" | "stairs" | "entrance" | "restroom" | "facility";
}

export interface NavEdge {
  id: string;
  sourceId: string;
  targetId: string;
  weight: number;
  accessible: boolean;
}

export interface PathResult {
  nodeIds: string[];
  totalDistance: number;
  turns: string[];
}

export interface FloorMetadata {
  id: CampusFloorId;
  name: string;
  shortLabel: string;
  svgFile: string;
  viewBox: string;
  departments: string[];
}

export const CAMPUS_FLOORS_CONFIG: FloorMetadata[] = [
  {
    id: 7,
    name: "Seventh Floor & Roof Deck",
    shortLabel: "7F",
    svgFile: "/campus/svg/floor-7-roofdeck.svg",
    viewBox: "0 0 1191 842",
    departments: ["HRM Mini Hotel", "Criminology Dean", "High School Roof Deck Gym", "PE Classrooms"],
  },
  {
    id: 6,
    name: "Sixth Floor",
    shortLabel: "6F",
    svgFile: "/campus/svg/floor-6.svg",
    viewBox: "0 0 1191 842",
    departments: ["Hotel & Restaurant Management (HRM)", "Kitchen & Baking Labs", "UC Bar & Restaurant"],
  },
  {
    id: 5,
    name: "Fifth Floor",
    shortLabel: "5F",
    svgFile: "/campus/svg/floor-5.svg",
    viewBox: "0 0 1191 842",
    departments: ["College of Computer Studies (CCS)", "Natural Sciences", "Physics & Chemistry Labs"],
  },
  {
    id: 4,
    name: "Fourth Floor",
    shortLabel: "4F",
    svgFile: "/campus/svg/floor-4.svg",
    viewBox: "0 0 1191 842",
    departments: ["High School Library", "Allied Engineering Labs", "Cisco & Microprocessor Labs"],
  },
  {
    id: 3,
    name: "Third Floor",
    shortLabel: "3F",
    svgFile: "/campus/svg/floor-3.svg",
    viewBox: "0 0 1191 842",
    departments: ["College of Criminology", "Commerce & Accountancy (CBE)", "College Library"],
  },
  {
    id: 2,
    name: "Second Floor",
    shortLabel: "2F",
    svgFile: "/campus/svg/floor-2.svg",
    viewBox: "0 0 1191 842",
    departments: ["Allied Engineering", "College of Arts & Sciences (AB)", "Main Library", "Administration"],
  },
  {
    id: "M",
    name: "Mezzanine Floor",
    shortLabel: "MF",
    svgFile: "/campus/svg/floor-mezzanine.svg",
    viewBox: "0 0 1191 842",
    departments: ["College of Teacher Education (CTE)", "Graduate School", "University Chapel", "Data Center"],
  },
  {
    id: 1,
    name: "Ground Floor",
    shortLabel: "1F",
    svgFile: "/campus/svg/floor-1-ground.svg",
    viewBox: "0 0 1191 842",
    departments: ["Campus Ingress Gates 1-4", "Registrar & Cashier", "Medical/Dental Clinic", "High School Activity Center"],
  },
];
