/**
 * ChronoNav Client-Side Pathfinding Engine
 * Implementation of Dijkstra's Algorithm for UC Main Campus
 * Complete multi-floor navigation covering all 8 levels:
 * Ground (1), Mezzanine (M), 2nd, 3rd, 4th, 5th, 6th, and 7th Floor / Roof Deck.
 */

export type FloorLevel = 1 | "M" | 2 | 3 | 4 | 5 | 6 | 7;

export interface Neighbor {
  nodeId: string;
  weight: number; // Distance in meters / edge weight
}

export interface Node {
  id: string;
  name: string;
  floor: FloorLevel;
  building?: "DON_MANUEL" | "CTS" | "HIGHSCHOOL" | "MAIN";
  x: number; // Normalized coordinate in 1191 x 842 SVG viewBox
  y: number;
  type?: "room" | "corridor" | "stairs" | "elevator" | "entrance" | "restroom" | "facility";
  neighbors: Neighbor[];
  description?: string;
  category?: "classroom" | "lab" | "office" | "facility" | "amenity";
}

export interface Waypoint {
  x: number;
  y: number;
  floor: FloorLevel;
  name: string;
  nodeId?: string;
}

export interface PathfindingResult {
  pathNodeIds: string[];
  totalDistance: number;
  waypoints: Waypoint[];
  instructions: string[];
  floorsTraversed: FloorLevel[];
}

/** Ordered sequence of campus floors for floor index comparison */
export const FLOOR_ORDER: FloorLevel[] = [1, "M", 2, 3, 4, 5, 6, 7];

export function getFloorIndex(floor: FloorLevel): number {
  const idx = FLOOR_ORDER.indexOf(floor);
  return idx === -1 ? 0 : idx;
}

/**
 * Finds the shortest path between startId and targetId using Dijkstra's algorithm.
 * Handles multi-floor transitions across all 8 campus floors via stairs and elevators.
 */
export function findShortestPath(
  graph: Record<string, Node>,
  startId: string,
  targetId: string
): PathfindingResult | null {
  if (!graph[startId] || !graph[targetId]) {
    return null;
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize graph node distances
  for (const nodeId of Object.keys(graph)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Select unvisited node with minimum distance
    let currentId: string | null = null;
    let smallestDistance = Infinity;

    for (const nodeId of Array.from(unvisited)) {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || distances[currentId] === Infinity) {
      break; // Remaining nodes are unreachable
    }

    if (currentId === targetId) {
      break; // Reached destination target
    }

    unvisited.delete(currentId);

    const currentNode = graph[currentId];
    if (!currentNode || !currentNode.neighbors) continue;

    for (const neighbor of currentNode.neighbors) {
      if (!unvisited.has(neighbor.nodeId)) continue;

      const alt = distances[currentId] + neighbor.weight;
      if (alt < distances[neighbor.nodeId]) {
        distances[neighbor.nodeId] = alt;
        previous[neighbor.nodeId] = currentId;
      }
    }
  }

  // Reconstruct shortest path node array
  const pathNodeIds: string[] = [];
  let curr: string | null = targetId;

  while (curr !== null) {
    pathNodeIds.unshift(curr);
    curr = previous[curr];
  }

  // Verify that the path starts at startId
  if (pathNodeIds[0] !== startId) {
    return null; // No path exists between start and target
  }

  // Build waypoints, instructions, and track floors traversed
  const waypoints: Waypoint[] = [];
  const instructions: string[] = [];
  const floorsSet = new Set<FloorLevel>();

  for (let i = 0; i < pathNodeIds.length; i++) {
    const node = graph[pathNodeIds[i]];
    floorsSet.add(node.floor);

    waypoints.push({
      x: node.x,
      y: node.y,
      floor: node.floor,
      name: node.name,
      nodeId: node.id,
    });

    const stepNum = i + 1;
    const floorLabel = node.floor === "M" ? "Mezzanine" : `Floor ${node.floor}`;

    if (i === 0) {
      instructions.push(`Step ${stepNum}: Start at ${node.name} (${floorLabel})`);
    } else {
      const prevNode = graph[pathNodeIds[i - 1]];
      if (node.floor !== prevNode.floor) {
        const prevFloorLabel = prevNode.floor === "M" ? "Mezzanine" : `Floor ${prevNode.floor}`;
        const minIdx = Math.min(getFloorIndex(prevNode.floor), getFloorIndex(node.floor));
        const maxIdx = Math.max(getFloorIndex(prevNode.floor), getFloorIndex(node.floor));
        for (let fi = minIdx; fi <= maxIdx; fi++) {
          floorsSet.add(FLOOR_ORDER[fi]);
        }
        const transitionType = node.type === "elevator" ? "Elevator" : "Central Staircase";
        instructions.push(
          `Step ${stepNum}: Take ${transitionType} from ${prevFloorLabel} to ${floorLabel}`
        );
      } else {
        if (i === pathNodeIds.length - 1) {
          instructions.push(`Step ${stepNum}: Arrive at destination — ${node.name} (${floorLabel})`);
        } else {
          instructions.push(`Step ${stepNum}: Walk through ${node.name}`);
        }
      }
    }
  }

  // Sort floors according to campus building sequence
  const sortedFloors = Array.from(floorsSet).sort(
    (a, b) => getFloorIndex(a) - getFloorIndex(b)
  );

  return {
    pathNodeIds,
    totalDistance: Math.round(distances[targetId]),
    waypoints,
    instructions,
    floorsTraversed: sortedFloors,
  };
}

/**
 * Complete University of Cebu Main Campus Graph Network
 * Spans All 8 Architectural Levels (Ground to 7th Floor)
 * Coordinate system calibrated to the 1191 x 842 SVG viewBox
 */
export class SampleCCSGraph {
  public static getSampleGraph(): Record<string, Node> {
    return {
      // ==========================================
      // FLOOR 1: Ground Floor / Main Ingress & Administration
      // ==========================================
      F1_GATE1: {
        id: "F1_GATE1",
        name: "Gate 1 Entrance / Exit",
        floor: 1,
        building: "MAIN",
        x: 230,
        y: 680,
        type: "entrance",
        category: "facility",
        description: "Main campus ingress gate along Sanciangko St. with security turnstiles.",
        neighbors: [
          { nodeId: "F1_GUARD_DESK", weight: 15 },
          { nodeId: "F1_LOBBY_JUNCTION", weight: 35 },
        ],
      },
      F1_GATE2: {
        id: "F1_GATE2",
        name: "Gate 2 Entrance / Exit",
        floor: 1,
        building: "DON_MANUEL",
        x: 480,
        y: 720,
        type: "entrance",
        category: "facility",
        description: "Secondary ingress gate leading to student services and cashier.",
        neighbors: [
          { nodeId: "F1_CASHIER", weight: 20 },
          { nodeId: "F1_LOBBY_JUNCTION", weight: 30 },
        ],
      },
      F1_GATE3: {
        id: "F1_GATE3",
        name: "Gate 3 Entrance / Exit",
        floor: 1,
        building: "CTS",
        x: 820,
        y: 710,
        type: "entrance",
        category: "facility",
        description: "Gate 3 entrance near high school activity center and clinic.",
        neighbors: [
          { nodeId: "F1_CLINIC", weight: 25 },
          { nodeId: "F1_EAST_CORRIDOR", weight: 30 },
        ],
      },
      F1_GATE4: {
        id: "F1_GATE4",
        name: "Gate 4 Entrance / Exit",
        floor: 1,
        building: "HIGHSCHOOL",
        x: 1050,
        y: 690,
        type: "entrance",
        category: "facility",
        description: "High school campus entrance and gymnasium access.",
        neighbors: [{ nodeId: "F1_HS_ACTIVITY_CENTER", weight: 35 }],
      },
      F1_GUARD_DESK: {
        id: "F1_GUARD_DESK",
        name: "Campus Security Desk",
        floor: 1,
        building: "MAIN",
        x: 280,
        y: 640,
        type: "facility",
        category: "facility",
        description: "Visitor verification and campus guard post.",
        neighbors: [
          { nodeId: "F1_GATE1", weight: 15 },
          { nodeId: "F1_LOBBY_JUNCTION", weight: 25 },
        ],
      },
      F1_LOBBY_JUNCTION: {
        id: "F1_LOBBY_JUNCTION",
        name: "Ground Floor Main Foyer",
        floor: 1,
        building: "MAIN",
        x: 420,
        y: 580,
        type: "corridor",
        category: "facility",
        description: "Central junction connecting Registrar, Cashier, Stairs, and Main Elevators.",
        neighbors: [
          { nodeId: "F1_GATE1", weight: 35 },
          { nodeId: "F1_GATE2", weight: 30 },
          { nodeId: "F1_GUARD_DESK", weight: 25 },
          { nodeId: "F1_REGISTRAR", weight: 30 },
          { nodeId: "F1_CASHIER", weight: 30 },
          { nodeId: "F1_ACCOUNTING", weight: 35 },
          { nodeId: "F1_MAC_LAB_101", weight: 45 },
          { nodeId: "F1_CANTEEN", weight: 50 },
          { nodeId: "F1_STAIRS", weight: 35 },
          { nodeId: "F1_ELEVATOR", weight: 30 },
          { nodeId: "F1_EAST_CORRIDOR", weight: 45 },
        ],
      },
      F1_REGISTRAR: {
        id: "F1_REGISTRAR",
        name: "College Registrar's Office",
        floor: 1,
        building: "MAIN",
        x: 350,
        y: 480,
        type: "room",
        category: "office",
        description: "Student records, enrollment processing, and transcript releases.",
        neighbors: [{ nodeId: "F1_LOBBY_JUNCTION", weight: 30 }],
      },
      F1_CASHIER: {
        id: "F1_CASHIER",
        name: "University Cashier & Assessment",
        floor: 1,
        building: "MAIN",
        x: 480,
        y: 480,
        type: "room",
        category: "office",
        description: "Tuition payment counters and financial verification.",
        neighbors: [
          { nodeId: "F1_LOBBY_JUNCTION", weight: 30 },
          { nodeId: "F1_GATE2", weight: 20 },
        ],
      },
      F1_ACCOUNTING: {
        id: "F1_ACCOUNTING",
        name: "Accounting Office",
        floor: 1,
        building: "DON_MANUEL",
        x: 580,
        y: 480,
        type: "room",
        category: "office",
        description: "Student billing, scholarship validations, and accounts office.",
        neighbors: [{ nodeId: "F1_LOBBY_JUNCTION", weight: 35 }],
      },
      F1_CLINIC: {
        id: "F1_CLINIC",
        name: "Medical & Dental Clinic",
        floor: 1,
        building: "CTS",
        x: 820,
        y: 540,
        type: "room",
        category: "facility",
        description: "Campus emergency medical response, physician consult, and dental services.",
        neighbors: [
          { nodeId: "F1_GATE3", weight: 25 },
          { nodeId: "F1_EAST_CORRIDOR", weight: 25 },
        ],
      },
      F1_HS_ACTIVITY_CENTER: {
        id: "F1_HS_ACTIVITY_CENTER",
        name: "High School Activity Center",
        floor: 1,
        building: "HIGHSCHOOL",
        x: 1020,
        y: 480,
        type: "facility",
        category: "facility",
        description: "Multipurpose covered gymnasium and institutional event hall.",
        neighbors: [
          { nodeId: "F1_GATE4", weight: 35 },
          { nodeId: "F1_EAST_CORRIDOR", weight: 40 },
        ],
      },
      F1_MAC_LAB_101: {
        id: "F1_MAC_LAB_101",
        name: "CCS Mac Laboratory 101",
        floor: 1,
        building: "MAIN",
        x: 240,
        y: 380,
        type: "room",
        category: "lab",
        description: "Apple Macintosh workstation laboratory for iOS and multimedia development (Cap: 45).",
        neighbors: [{ nodeId: "F1_LOBBY_JUNCTION", weight: 45 }],
      },
      F1_CANTEEN: {
        id: "F1_CANTEEN",
        name: "Main Campus Canteen",
        floor: 1,
        building: "MAIN",
        x: 140,
        y: 420,
        type: "facility",
        category: "amenity",
        description: "Food court, refreshment stalls, and student dining area.",
        neighbors: [{ nodeId: "F1_LOBBY_JUNCTION", weight: 50 }],
      },
      F1_EAST_CORRIDOR: {
        id: "F1_EAST_CORRIDOR",
        name: "East Wing Ground Corridor",
        floor: 1,
        building: "CTS",
        x: 720,
        y: 580,
        type: "corridor",
        category: "facility",
        description: "Corridor linking main lobby to clinic and high school wing.",
        neighbors: [
          { nodeId: "F1_LOBBY_JUNCTION", weight: 45 },
          { nodeId: "F1_CLINIC", weight: 25 },
          { nodeId: "F1_HS_ACTIVITY_CENTER", weight: 40 },
          { nodeId: "F1_GATE3", weight: 30 },
        ],
      },
      F1_RESTROOM: {
        id: "F1_RESTROOM",
        name: "Ground Floor Restrooms (Male & Female)",
        floor: 1,
        building: "MAIN",
        x: 640,
        y: 620,
        type: "restroom",
        category: "amenity",
        description: "Male and female restrooms located on the ground floor.",
        neighbors: [{ nodeId: "F1_LOBBY_JUNCTION", weight: 30 }],
      },
      F1_STAIRS: {
        id: "F1_STAIRS",
        name: "Central Staircase (Floor 1)",
        floor: 1,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Central concrete staircase connecting Ground Floor to Mezzanine and upper levels.",
        neighbors: [
          { nodeId: "F1_LOBBY_JUNCTION", weight: 35 },
          { nodeId: "FM_STAIRS", weight: 30 },
        ],
      },
      F1_ELEVATOR: {
        id: "F1_ELEVATOR",
        name: "Main Elevator Bank (Floor 1)",
        floor: 1,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "High-capacity passenger elevators serving Floors 1 through 7.",
        neighbors: [
          { nodeId: "F1_LOBBY_JUNCTION", weight: 30 },
          { nodeId: "FM_ELEVATOR", weight: 15 },
          { nodeId: "F2_ELEVATOR", weight: 25 },
          { nodeId: "F3_ELEVATOR", weight: 35 },
          { nodeId: "F4_ELEVATOR", weight: 45 },
          { nodeId: "F5_ELEVATOR", weight: 55 },
          { nodeId: "F6_ELEVATOR", weight: 65 },
          { nodeId: "F7_ELEVATOR", weight: 75 },
        ],
      },

      // ==========================================
      // MEZZANINE FLOOR (MF): Education, Chapel & Graduate School
      // ==========================================
      FM_STAIRS: {
        id: "FM_STAIRS",
        name: "Central Staircase (Mezzanine)",
        floor: "M",
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stair landing on Mezzanine level.",
        neighbors: [
          { nodeId: "F1_STAIRS", weight: 30 },
          { nodeId: "FM_CORRIDOR_1", weight: 25 },
          { nodeId: "F2_STAIRS", weight: 30 },
        ],
      },
      FM_ELEVATOR: {
        id: "FM_ELEVATOR",
        name: "Main Elevator Bank (Mezzanine)",
        floor: "M",
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator access point on Mezzanine floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 15 },
          { nodeId: "FM_CORRIDOR_1", weight: 20 },
          { nodeId: "F2_ELEVATOR", weight: 15 },
          { nodeId: "F3_ELEVATOR", weight: 25 },
          { nodeId: "F4_ELEVATOR", weight: 35 },
          { nodeId: "F5_ELEVATOR", weight: 45 },
          { nodeId: "F6_ELEVATOR", weight: 55 },
          { nodeId: "F7_ELEVATOR", weight: 65 },
        ],
      },
      FM_CORRIDOR_1: {
        id: "FM_CORRIDOR_1",
        name: "Mezzanine Main Corridor",
        floor: "M",
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Central corridor for Teacher Education and Graduate School offices.",
        neighbors: [
          { nodeId: "FM_STAIRS", weight: 25 },
          { nodeId: "FM_ELEVATOR", weight: 20 },
          { nodeId: "FM_CTE_DEAN", weight: 30 },
          { nodeId: "FM_GRAD_SCHOOL_LIB", weight: 35 },
          { nodeId: "FM_CHAPEL", weight: 40 },
          { nodeId: "FM_DATA_CENTER", weight: 35 },
          { nodeId: "FM_CORRIDOR_2", weight: 40 },
        ],
      },
      FM_CTE_DEAN: {
        id: "FM_CTE_DEAN",
        name: "Dean's Office (College of Teacher Education)",
        floor: "M",
        building: "MAIN",
        x: 360,
        y: 420,
        type: "room",
        category: "office",
        description: "Office of the Dean, College of Teacher Education (CTE).",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 30 }],
      },
      FM_GRAD_SCHOOL_LIB: {
        id: "FM_GRAD_SCHOOL_LIB",
        name: "Graduate School Library & GSR 1-4",
        floor: "M",
        building: "DON_MANUEL",
        x: 650,
        y: 440,
        type: "room",
        category: "facility",
        description: "Specialized research library and graduate study rooms.",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 35 }],
      },
      FM_CHAPEL: {
        id: "FM_CHAPEL",
        name: "University Chapel & Campus Ministry",
        floor: "M",
        building: "CTS",
        x: 840,
        y: 440,
        type: "facility",
        category: "amenity",
        description: "University chapel for prayer, masses, and campus ministry.",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 40 }],
      },
      FM_DATA_CENTER: {
        id: "FM_DATA_CENTER",
        name: "Data Center & Server Room",
        floor: "M",
        building: "MAIN",
        x: 420,
        y: 320,
        type: "room",
        category: "facility",
        description: "Campus enterprise core server room and networking infrastructure.",
        neighbors: [{ nodeId: "FM_CORRIDOR_1", weight: 35 }],
      },
      FM_CORRIDOR_2: {
        id: "FM_CORRIDOR_2",
        name: "Mezzanine Computer Labs Hallway",
        floor: "M",
        building: "DON_MANUEL",
        x: 580,
        y: 550,
        type: "corridor",
        category: "facility",
        description: "Corridor accessing Computer Labs 1, 2, 3, and 4.",
        neighbors: [
          { nodeId: "FM_CORRIDOR_1", weight: 40 },
          { nodeId: "FM_COMP_LAB_1", weight: 25 },
          { nodeId: "FM_COMP_LAB_2", weight: 25 },
        ],
      },
      FM_COMP_LAB_1: {
        id: "FM_COMP_LAB_1",
        name: "Computer Lab 1 (Mezzanine)",
        floor: "M",
        building: "DON_MANUEL",
        x: 640,
        y: 620,
        type: "room",
        category: "lab",
        description: "Hands-on computer laboratory for teacher education and graduate research.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 25 }],
      },
      FM_COMP_LAB_2: {
        id: "FM_COMP_LAB_2",
        name: "Computer Lab 2 (Mezzanine)",
        floor: "M",
        building: "DON_MANUEL",
        x: 740,
        y: 620,
        type: "room",
        category: "lab",
        description: "General multimedia computer laboratory.",
        neighbors: [{ nodeId: "FM_CORRIDOR_2", weight: 25 }],
      },

      // ==========================================
      // FLOOR 2: Allied Engineering, Arts & Sciences, Main Library
      // ==========================================
      F2_STAIRS: {
        id: "F2_STAIRS",
        name: "Central Staircase (Floor 2)",
        floor: 2,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 2nd Floor.",
        neighbors: [
          { nodeId: "FM_STAIRS", weight: 30 },
          { nodeId: "F2_CORRIDOR_1", weight: 25 },
          { nodeId: "F3_STAIRS", weight: 30 },
        ],
      },
      F2_ELEVATOR: {
        id: "F2_ELEVATOR",
        name: "Main Elevator Bank (Floor 2)",
        floor: 2,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 2nd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 25 },
          { nodeId: "FM_ELEVATOR", weight: 15 },
          { nodeId: "F2_CORRIDOR_1", weight: 20 },
          { nodeId: "F3_ELEVATOR", weight: 15 },
          { nodeId: "F4_ELEVATOR", weight: 25 },
          { nodeId: "F5_ELEVATOR", weight: 35 },
          { nodeId: "F6_ELEVATOR", weight: 45 },
          { nodeId: "F7_ELEVATOR", weight: 55 },
        ],
      },
      F2_CORRIDOR_1: {
        id: "F2_CORRIDOR_1",
        name: "Floor 2 Central Corridor",
        floor: 2,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Main corridor connecting Main Library, Engineering, and Administration.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 25 },
          { nodeId: "F2_ELEVATOR", weight: 20 },
          { nodeId: "F2_MAIN_LIB", weight: 40 },
          { nodeId: "F2_ALLIED_ENG_DEAN", weight: 35 },
          { nodeId: "F2_CHANCELLOR_OFFICE", weight: 30 },
          { nodeId: "F2_PSYCHOLOGY_LAB", weight: 35 },
          { nodeId: "F2_PROG_LAB_201", weight: 35 },
        ],
      },
      F2_MAIN_LIB: {
        id: "F2_MAIN_LIB",
        name: "University Main Library (Floor 2)",
        floor: 2,
        building: "DON_MANUEL",
        x: 750,
        y: 420,
        type: "facility",
        category: "facility",
        description: "University general reference collection, reading lounge, and study carrels.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 40 }],
      },
      F2_ALLIED_ENG_DEAN: {
        id: "F2_ALLIED_ENG_DEAN",
        name: "Dean's Office (Allied Engineering)",
        floor: 2,
        building: "MAIN",
        x: 380,
        y: 420,
        type: "room",
        category: "office",
        description: "Office of the Dean for Civil, Mechanical, and Electrical Engineering.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 35 }],
      },
      F2_CHANCELLOR_OFFICE: {
        id: "F2_CHANCELLOR_OFFICE",
        name: "Chancellor's Executive Suite",
        floor: 2,
        building: "MAIN",
        x: 320,
        y: 340,
        type: "room",
        category: "office",
        description: "Offices of the Chancellor, Vice Chancellor, and University Legal Counsel.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 30 }],
      },
      F2_PSYCHOLOGY_LAB: {
        id: "F2_PSYCHOLOGY_LAB",
        name: "Psychology & Testing Laboratory (Room 219)",
        floor: 2,
        building: "MAIN",
        x: 240,
        y: 450,
        type: "room",
        category: "lab",
        description: "Psychological assessment, behavioral observation, and counseling suites.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 35 }],
      },
      F2_PROG_LAB_201: {
        id: "F2_PROG_LAB_201",
        name: "Programming Lab 201 (CL2)",
        floor: 2,
        building: "MAIN",
        x: 220,
        y: 560,
        type: "room",
        category: "lab",
        description: "High-spec programming lab for Java, C++, and Python courses.",
        neighbors: [{ nodeId: "F2_CORRIDOR_1", weight: 35 }],
      },

      // ==========================================
      // FLOOR 3: College of Criminology, Commerce (CBE), College Library
      // ==========================================
      F3_STAIRS: {
        id: "F3_STAIRS",
        name: "Central Staircase (Floor 3)",
        floor: 3,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 3rd Floor.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 30 },
          { nodeId: "F3_CORRIDOR_1", weight: 25 },
          { nodeId: "F4_STAIRS", weight: 30 },
        ],
      },
      F3_ELEVATOR: {
        id: "F3_ELEVATOR",
        name: "Main Elevator Bank (Floor 3)",
        floor: 3,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 3rd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 35 },
          { nodeId: "F2_ELEVATOR", weight: 15 },
          { nodeId: "F3_CORRIDOR_1", weight: 20 },
          { nodeId: "F4_ELEVATOR", weight: 15 },
          { nodeId: "F5_ELEVATOR", weight: 25 },
          { nodeId: "F6_ELEVATOR", weight: 35 },
          { nodeId: "F7_ELEVATOR", weight: 45 },
        ],
      },
      F3_CORRIDOR_1: {
        id: "F3_CORRIDOR_1",
        name: "Floor 3 Central Corridor",
        floor: 3,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Corridor for Criminology, College Library, and Commerce lecture halls.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 25 },
          { nodeId: "F3_ELEVATOR", weight: 20 },
          { nodeId: "F3_COLLEGE_LIB", weight: 40 },
          { nodeId: "F3_CRIM_AVR", weight: 35 },
          { nodeId: "F3_FORENSIC_LAB", weight: 35 },
          { nodeId: "F3_COMMERCE_DEAN", weight: 30 },
          { nodeId: "F3_NETWORK_LAB_301", weight: 40 },
        ],
      },
      F3_COLLEGE_LIB: {
        id: "F3_COLLEGE_LIB",
        name: "College Library & Study Commons",
        floor: 3,
        building: "DON_MANUEL",
        x: 750,
        y: 420,
        type: "facility",
        category: "facility",
        description: "College department book collections and quiet research tables.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 40 }],
      },
      F3_CRIM_AVR: {
        id: "F3_CRIM_AVR",
        name: "Criminology Audio-Visual Hall (AVR 2)",
        floor: 3,
        building: "CTS",
        x: 880,
        y: 480,
        type: "room",
        category: "classroom",
        description: "Amphitheater for moot court trials, defense hearings, and seminars.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 35 }],
      },
      F3_FORENSIC_LAB: {
        id: "F3_FORENSIC_LAB",
        name: "Forensic Science & Dactyloscopy Lab",
        floor: 3,
        building: "MAIN",
        x: 320,
        y: 420,
        type: "room",
        category: "lab",
        description: "Fingerprint analysis, ballistics study, and crime scene investigation lab.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 35 }],
      },
      F3_COMMERCE_DEAN: {
        id: "F3_COMMERCE_DEAN",
        name: "Dean's Office (Commerce & Accountancy)",
        floor: 3,
        building: "MAIN",
        x: 420,
        y: 340,
        type: "room",
        category: "office",
        description: "Office of the Dean, College of Business & Accountancy (CBE).",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 30 }],
      },
      F3_NETWORK_LAB_301: {
        id: "F3_NETWORK_LAB_301",
        name: "Cisco Networking Lab 301 (CL3)",
        floor: 3,
        building: "MAIN",
        x: 200,
        y: 480,
        type: "room",
        category: "lab",
        description: "CCNA networking lab with rack-mounted routers and switches.",
        neighbors: [{ nodeId: "F3_CORRIDOR_1", weight: 40 }],
      },

      // ==========================================
      // FLOOR 4: High School Library & Engineering Labs
      // ==========================================
      F4_STAIRS: {
        id: "F4_STAIRS",
        name: "Central Staircase (Floor 4)",
        floor: 4,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 4th Floor.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 30 },
          { nodeId: "F4_CORRIDOR_1", weight: 25 },
          { nodeId: "F5_STAIRS", weight: 30 },
        ],
      },
      F4_ELEVATOR: {
        id: "F4_ELEVATOR",
        name: "Main Elevator Bank (Floor 4)",
        floor: 4,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 4th Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 45 },
          { nodeId: "F3_ELEVATOR", weight: 15 },
          { nodeId: "F4_CORRIDOR_1", weight: 20 },
          { nodeId: "F5_ELEVATOR", weight: 15 },
          { nodeId: "F6_ELEVATOR", weight: 25 },
          { nodeId: "F7_ELEVATOR", weight: 35 },
        ],
      },
      F4_CORRIDOR_1: {
        id: "F4_CORRIDOR_1",
        name: "Floor 4 Engineering Corridor",
        floor: 4,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Access corridor for microprocessor, digital, and biology laboratories.",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 25 },
          { nodeId: "F4_ELEVATOR", weight: 20 },
          { nodeId: "F4_HS_LIB", weight: 40 },
          { nodeId: "F4_MICROPROCESSOR_LAB", weight: 35 },
          { nodeId: "F4_DIGITAL_SECTION", weight: 35 },
          { nodeId: "F4_BIOLOGY_LAB", weight: 40 },
          { nodeId: "F4_AV_HALL_401", weight: 40 },
        ],
      },
      F4_HS_LIB: {
        id: "F4_HS_LIB",
        name: "High School Library (Floor 4)",
        floor: 4,
        building: "DON_MANUEL",
        x: 780,
        y: 420,
        type: "facility",
        category: "facility",
        description: "Junior and Senior High School textbook collection and study hall.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 40 }],
      },
      F4_MICROPROCESSOR_LAB: {
        id: "F4_MICROPROCESSOR_LAB",
        name: "Microprocessor & Embedded Systems Lab",
        floor: 4,
        building: "MAIN",
        x: 320,
        y: 420,
        type: "room",
        category: "lab",
        description: "Computer Engineering lab equipped with trainer kits, microcontrollers, and oscilloscopes.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 35 }],
      },
      F4_DIGITAL_SECTION: {
        id: "F4_DIGITAL_SECTION",
        name: "Digital Circuits & Machine Design Lab",
        floor: 4,
        building: "MAIN",
        x: 220,
        y: 440,
        type: "room",
        category: "lab",
        description: "Hardware logic gates and digital communications lab.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 35 }],
      },
      F4_BIOLOGY_LAB: {
        id: "F4_BIOLOGY_LAB",
        name: "Biology & Chemistry Science Lab (Room 418)",
        floor: 4,
        building: "CTS",
        x: 920,
        y: 460,
        type: "room",
        category: "lab",
        description: "General natural science lab with specimen stockroom.",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 40 }],
      },
      F4_AV_HALL_401: {
        id: "F4_AV_HALL_401",
        name: "CCS Multipurpose AV Hall 401",
        floor: 4,
        building: "MAIN",
        x: 420,
        y: 560,
        type: "room",
        category: "classroom",
        description: "Acoustically-treated amphitheater for college conferences and hackathons (Cap: 180).",
        neighbors: [{ nodeId: "F4_CORRIDOR_1", weight: 40 }],
      },

      // ==========================================
      // FLOOR 5: College of Computer Studies (CCS) & Natural Sciences
      // ==========================================
      F5_STAIRS: {
        id: "F5_STAIRS",
        name: "Central Staircase (Floor 5)",
        floor: 5,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 5th Floor (CCS Department).",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 30 },
          { nodeId: "F5_CORRIDOR_1", weight: 25 },
          { nodeId: "F6_STAIRS", weight: 30 },
        ],
      },
      F5_ELEVATOR: {
        id: "F5_ELEVATOR",
        name: "Main Elevator Bank (Floor 5)",
        floor: 5,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator access point for College of Computer Studies.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 55 },
          { nodeId: "F4_ELEVATOR", weight: 15 },
          { nodeId: "F5_CORRIDOR_1", weight: 20 },
          { nodeId: "F6_ELEVATOR", weight: 15 },
          { nodeId: "F7_ELEVATOR", weight: 25 },
        ],
      },
      F5_CORRIDOR_1: {
        id: "F5_CORRIDOR_1",
        name: "Floor 5 CCS Innovation Corridor",
        floor: 5,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Central corridor outside CCS Dean's office and Smart Classrooms.",
        neighbors: [
          { nodeId: "F5_STAIRS", weight: 25 },
          { nodeId: "F5_ELEVATOR", weight: 20 },
          { nodeId: "F5_DEAN_OFFICE", weight: 30 },
          { nodeId: "F5_LECTURE_538", weight: 35 },
          { nodeId: "F5_SPEECH_LAB", weight: 35 },
          { nodeId: "F5_CHEMISTRY_LAB", weight: 40 },
          { nodeId: "F5_BOTANICAL_GARDEN", weight: 45 },
          { nodeId: "F5_PSITS_OFFICE", weight: 30 },
        ],
      },
      F5_DEAN_OFFICE: {
        id: "F5_DEAN_OFFICE",
        name: "Dean's Office (College of Computer Studies)",
        floor: 5,
        building: "MAIN",
        x: 360,
        y: 420,
        type: "room",
        category: "office",
        description: "Office of the Dean, CCS Chairs, and faculty departmental desks.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 30 }],
      },
      F5_LECTURE_538: {
        id: "F5_LECTURE_538",
        name: "CCS Smart Classroom 538",
        floor: 5,
        building: "MAIN",
        x: 240,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Premier 5th floor smart classroom equipped with interactive displays (Cap: 65).",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 35 }],
      },
      F5_SPEECH_LAB: {
        id: "F5_SPEECH_LAB",
        name: "Digital Speech & Language Lab",
        floor: 5,
        building: "MAIN",
        x: 420,
        y: 560,
        type: "room",
        category: "lab",
        description: "Acoustic booths for oral communication and linguistics courses.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 35 }],
      },
      F5_CHEMISTRY_LAB: {
        id: "F5_CHEMISTRY_LAB",
        name: "College Chemistry Lab (Room 533-537)",
        floor: 5,
        building: "DON_MANUEL",
        x: 750,
        y: 420,
        type: "room",
        category: "lab",
        description: "Equipped wet chemistry laboratory with fume hoods and titration benches.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 40 }],
      },
      F5_BOTANICAL_GARDEN: {
        id: "F5_BOTANICAL_GARDEN",
        name: "Biology Botanical Garden & Science Wing",
        floor: 5,
        building: "CTS",
        x: 920,
        y: 440,
        type: "facility",
        category: "facility",
        description: "Rooftop greenhouse and botanical research collection.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 45 }],
      },
      F5_PSITS_OFFICE: {
        id: "F5_PSITS_OFFICE",
        name: "PSITS & Student Council Office",
        floor: 5,
        building: "MAIN",
        x: 460,
        y: 340,
        type: "room",
        category: "office",
        description: "Philippine Society of Information Technology Students headquarters.",
        neighbors: [{ nodeId: "F5_CORRIDOR_1", weight: 30 }],
      },

      // ==========================================
      // FLOOR 6: Hotel & Restaurant Management (HRM) & Food Labs
      // ==========================================
      F6_STAIRS: {
        id: "F6_STAIRS",
        name: "Central Staircase (Floor 6)",
        floor: 6,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on 6th Floor (HRM Department).",
        neighbors: [
          { nodeId: "F5_STAIRS", weight: 30 },
          { nodeId: "F6_CORRIDOR_1", weight: 25 },
          { nodeId: "F7_STAIRS", weight: 30 },
        ],
      },
      F6_ELEVATOR: {
        id: "F6_ELEVATOR",
        name: "Main Elevator Bank (Floor 6)",
        floor: 6,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Elevator landing on 6th Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 65 },
          { nodeId: "F5_ELEVATOR", weight: 15 },
          { nodeId: "F6_CORRIDOR_1", weight: 20 },
          { nodeId: "F7_ELEVATOR", weight: 15 },
        ],
      },
      F6_CORRIDOR_1: {
        id: "F6_CORRIDOR_1",
        name: "Floor 6 Culinary Corridor",
        floor: 6,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Access corridor for commercial kitchens, baking labs, and restaurant simulation suites.",
        neighbors: [
          { nodeId: "F6_STAIRS", weight: 25 },
          { nodeId: "F6_ELEVATOR", weight: 20 },
          { nodeId: "F6_KITCHEN_LAB_1", weight: 35 },
          { nodeId: "F6_BAKING_LAB", weight: 35 },
          { nodeId: "F6_UC_BAR", weight: 40 },
          { nodeId: "F6_UC_RESTAURANT", weight: 40 },
          { nodeId: "F6_ROOM_637", weight: 35 },
        ],
      },
      F6_KITCHEN_LAB_1: {
        id: "F6_KITCHEN_LAB_1",
        name: "Commercial Kitchen Lab 1",
        floor: 6,
        building: "MAIN",
        x: 340,
        y: 440,
        type: "room",
        category: "lab",
        description: "Heavy-duty commercial cooking ranges, prep stations, and walk-in chillers.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 35 }],
      },
      F6_BAKING_LAB: {
        id: "F6_BAKING_LAB",
        name: "Baking & Pastry Arts Lab",
        floor: 6,
        building: "MAIN",
        x: 220,
        y: 440,
        type: "room",
        category: "lab",
        description: "Professional pastry ovens, planetary mixers, and chocolate tempering stations.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 35 }],
      },
      F6_UC_BAR: {
        id: "F6_UC_BAR",
        name: "UC Bartending & Mixology Suite",
        floor: 6,
        building: "DON_MANUEL",
        x: 720,
        y: 440,
        type: "room",
        category: "lab",
        description: "Beverage service training bar, mocktail stations, and flairtending floor.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 40 }],
      },
      F6_UC_RESTAURANT: {
        id: "F6_UC_RESTAURANT",
        name: "UC Dining Room & Restaurant Simulation",
        floor: 6,
        building: "DON_MANUEL",
        x: 850,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Fine dining simulation banquet hall and table service training suite.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 40 }],
      },
      F6_ROOM_637: {
        id: "F6_ROOM_637",
        name: "HRM Lecture Room 637",
        floor: 6,
        building: "MAIN",
        x: 440,
        y: 560,
        type: "room",
        category: "classroom",
        description: "Hospitality management and food safety lecture hall.",
        neighbors: [{ nodeId: "F6_CORRIDOR_1", weight: 35 }],
      },

      // ==========================================
      // FLOOR 7: Seventh Floor / Roof Deck Gym & HRM Mini Hotel
      // ==========================================
      F7_STAIRS: {
        id: "F7_STAIRS",
        name: "Central Staircase (Floor 7)",
        floor: 7,
        building: "MAIN",
        x: 520,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Top floor staircase landing for Roof Deck and Mini Hotel.",
        neighbors: [
          { nodeId: "F6_STAIRS", weight: 30 },
          { nodeId: "F7_CORRIDOR_1", weight: 25 },
        ],
      },
      F7_ELEVATOR: {
        id: "F7_ELEVATOR",
        name: "Main Elevator Bank (Floor 7)",
        floor: 7,
        building: "MAIN",
        x: 580,
        y: 380,
        type: "elevator",
        category: "facility",
        description: "Top floor elevator vestibule.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 75 },
          { nodeId: "F6_ELEVATOR", weight: 15 },
          { nodeId: "F7_CORRIDOR_1", weight: 20 },
        ],
      },
      F7_CORRIDOR_1: {
        id: "F7_CORRIDOR_1",
        name: "Floor 7 Rooftop Foyer",
        floor: 7,
        building: "MAIN",
        x: 480,
        y: 460,
        type: "corridor",
        category: "facility",
        description: "Access foyer to High School Roof Deck Gym, HRM Mini Hotel, and PE classrooms.",
        neighbors: [
          { nodeId: "F7_STAIRS", weight: 25 },
          { nodeId: "F7_ELEVATOR", weight: 20 },
          { nodeId: "F7_HRM_MINI_HOTEL", weight: 35 },
          { nodeId: "F7_ROOF_DECK_GYM", weight: 45 },
          { nodeId: "F7_CRIM_DEAN", weight: 30 },
          { nodeId: "F7_PE_ROOM_724", weight: 35 },
        ],
      },
      F7_HRM_MINI_HOTEL: {
        id: "F7_HRM_MINI_HOTEL",
        name: "HRM Mini Hotel Suite & Housekeeping Lab",
        floor: 7,
        building: "MAIN",
        x: 320,
        y: 440,
        type: "room",
        category: "lab",
        description: "Simulated executive hotel suite, front office reception desk, and housekeeping suite.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 35 }],
      },
      F7_ROOF_DECK_GYM: {
        id: "F7_ROOF_DECK_GYM",
        name: "High School Roof Deck Gymnasium",
        floor: 7,
        building: "HIGHSCHOOL",
        x: 920,
        y: 440,
        type: "facility",
        category: "facility",
        description: "Rooftop basketball court, athletics arena, and physical education open deck.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 45 }],
      },
      F7_CRIM_DEAN: {
        id: "F7_CRIM_DEAN",
        name: "Dean's Office (College of Criminology)",
        floor: 7,
        building: "MAIN",
        x: 420,
        y: 340,
        type: "room",
        category: "office",
        description: "Executive office of the Dean for Criminology and Law Enforcement Administration.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 30 }],
      },
      F7_PE_ROOM_724: {
        id: "F7_PE_ROOM_724",
        name: "PE Lecture Room 724",
        floor: 7,
        building: "MAIN",
        x: 220,
        y: 440,
        type: "room",
        category: "classroom",
        description: "Physical Education lecture and wellness classroom.",
        neighbors: [{ nodeId: "F7_CORRIDOR_1", weight: 35 }],
      },
    };
  }
}

/**
 * Mapping table from user/schedule room codes to primary graph node IDs across all 8 floors.
 */
export const ROOM_NODE_MAPPING: Record<string, string> = {
  // Floor 7
  "MINI HOTEL": "F7_HRM_MINI_HOTEL",
  "HRM HOTEL": "F7_HRM_MINI_HOTEL",
  "ROOF DECK": "F7_ROOF_DECK_GYM",
  "GYM": "F7_ROOF_DECK_GYM",
  "CRIMINOLOGY DEAN": "F7_CRIM_DEAN",
  "724": "F7_PE_ROOM_724",
  "ROOM 724": "F7_PE_ROOM_724",

  // Floor 6
  "KITCHEN LAB 1": "F6_KITCHEN_LAB_1",
  "KITCHEN 1": "F6_KITCHEN_LAB_1",
  "BAKING LAB": "F6_BAKING_LAB",
  "PASTRY LAB": "F6_BAKING_LAB",
  "UC BAR": "F6_UC_BAR",
  "BARTENDING": "F6_UC_BAR",
  "UC RESTAURANT": "F6_UC_RESTAURANT",
  "RESTAURANT": "F6_UC_RESTAURANT",
  "637": "F6_ROOM_637",
  "ROOM 637": "F6_ROOM_637",

  // Floor 5
  "CCS 538": "F5_LECTURE_538",
  "538": "F5_LECTURE_538",
  "ROOM 538": "F5_LECTURE_538",
  "CCS DEAN": "F5_DEAN_OFFICE",
  "SPEECH LAB": "F5_SPEECH_LAB",
  "CHEMISTRY LAB": "F5_CHEMISTRY_LAB",
  "BOTANICAL GARDEN": "F5_BOTANICAL_GARDEN",
  "PSITS": "F5_PSITS_OFFICE",

  // Floor 4
  "HS LIBRARY": "F4_HS_LIB",
  "MICROPROCESSOR": "F4_MICROPROCESSOR_LAB",
  "DIGITAL LAB": "F4_DIGITAL_SECTION",
  "BIOLOGY LAB": "F4_BIOLOGY_LAB",
  "CCS 401": "F4_AV_HALL_401",
  "AV HALL 401": "F4_AV_HALL_401",

  // Floor 3
  "COLLEGE LIBRARY": "F3_COLLEGE_LIB",
  "CRIMINOLOGY AVR": "F3_CRIM_AVR",
  "AVR 2": "F3_CRIM_AVR",
  "FORENSIC LAB": "F3_FORENSIC_LAB",
  "COMMERCE DEAN": "F3_COMMERCE_DEAN",
  "CISCO LAB": "F3_NETWORK_LAB_301",
  "CCS 301": "F3_NETWORK_LAB_301",

  // Floor 2
  "MAIN LIBRARY": "F2_MAIN_LIB",
  "ENGINEERING DEAN": "F2_ALLIED_ENG_DEAN",
  "CHANCELLOR": "F2_CHANCELLOR_OFFICE",
  "PSYCHOLOGY LAB": "F2_PSYCHOLOGY_LAB",
  "219": "F2_PSYCHOLOGY_LAB",
  "PROG LAB 201": "F2_PROG_LAB_201",
  "CCS 201": "F2_PROG_LAB_201",

  // Mezzanine Floor
  "CTE DEAN": "FM_CTE_DEAN",
  "EDUCATION DEAN": "FM_CTE_DEAN",
  "GRADUATE LIBRARY": "FM_GRAD_SCHOOL_LIB",
  "CHAPEL": "FM_CHAPEL",
  "DATA CENTER": "FM_DATA_CENTER",
  "COMP LAB 1": "FM_COMP_LAB_1",
  "COMP LAB 2": "FM_COMP_LAB_2",

  // Floor 1
  "GATE 1": "F1_GATE1",
  "GATE 2": "F1_GATE2",
  "GATE 3": "F1_GATE3",
  "GATE 4": "F1_GATE4",
  "REGISTRAR": "F1_REGISTRAR",
  "CASHIER": "F1_CASHIER",
  "ACCOUNTING": "F1_ACCOUNTING",
  "CLINIC": "F1_CLINIC",
  "HS ACTIVITY CENTER": "F1_HS_ACTIVITY_CENTER",
  "MAC LAB 101": "F1_MAC_LAB_101",
  "MAC LAB": "F1_MAC_LAB_101",
  "CANTEEN": "F1_CANTEEN",
  "SECURITY": "F1_GUARD_DESK",
};

/**
 * Resolves a room code string into a valid graph node ID.
 */
export function getGraphNodeForRoom(roomCode: string): string {
  if (!roomCode) return "F5_LECTURE_538";
  const upperRoom = roomCode.toUpperCase().trim();
  return ROOM_NODE_MAPPING[upperRoom] || "F5_LECTURE_538";
}
