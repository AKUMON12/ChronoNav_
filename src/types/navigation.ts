export interface NavNode {
  id: string;
  floorId: string;
  x: number;
  y: number;
  label?: string;
  type: "room" | "corridor" | "elevator" | "stairs" | "entrance" | "restroom";
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
