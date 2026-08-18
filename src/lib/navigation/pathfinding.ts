/**
 * ChronoNav Client-Side Pathfinding Engine
 * Implementation of Dijkstra's Algorithm for UC Main Campus (College of Computer Studies)
 * Complete multi-floor navigation covering Floors 1 to 5 with stair and elevator transitions.
 */

export interface Neighbor {
  nodeId: string;
  weight: number; // Distance in meters / edge weight
}

export interface Node {
  id: string;
  name: string;
  floor: number;
  x: number;
  y: number;
  type?: 'room' | 'corridor' | 'stairs' | 'elevator' | 'entrance' | 'restroom' | 'facility';
  neighbors: Neighbor[];
  description?: string;
  category?: 'classroom' | 'lab' | 'office' | 'facility' | 'amenity';
}

export interface Waypoint {
  x: number;
  y: number;
  floor: number;
  name: string;
  nodeId?: string;
}

export interface PathfindingResult {
  pathNodeIds: string[];
  totalDistance: number;
  waypoints: Waypoint[];
  instructions: string[];
  floorsTraversed: number[];
}

/**
 * Finds the shortest path between startId and targetId using Dijkstra's algorithm.
 * Handles seamless multi-floor navigation through stairs and elevators.
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
  const floorsSet = new Set<number>();

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

    if (i === 0) {
      instructions.push(`Step ${stepNum}: Start at ${node.name} (Floor ${node.floor})`);
    } else {
      const prevNode = graph[pathNodeIds[i - 1]];
      if (node.floor !== prevNode.floor) {
        const minF = Math.min(prevNode.floor, node.floor);
        const maxF = Math.max(prevNode.floor, node.floor);
        for (let f = minF; f <= maxF; f++) {
          floorsSet.add(f);
        }
        const transitionType = node.type === "elevator" ? "Elevator" : "Central Stairwell";
        instructions.push(
          `Step ${stepNum}: Take ${transitionType} from Floor ${prevNode.floor} to Floor ${node.floor}`
        );
      } else {
        if (i === pathNodeIds.length - 1) {
          instructions.push(`Step ${stepNum}: Arrive at destination — ${node.name} (Floor ${node.floor})`);
        } else {
          instructions.push(`Step ${stepNum}: Walk through ${node.name}`);
        }
      }
    }
  }

  return {
    pathNodeIds,
    totalDistance: Math.round(distances[targetId]),
    waypoints,
    instructions,
    floorsTraversed: Array.from(floorsSet).sort((a, b) => a - b),
  };
}

/**
 * University of Cebu Main Campus (CCS Building) Graph Network
 * Complete 5-Floor Map Representation (Floors 1 to 5)
 */
export class SampleCCSGraph {
  public static getSampleGraph(): Record<string, Node> {
    return {
      // ==========================================
      // FLOOR 1: Ground Floor / Entrance & Lobby
      // ==========================================
      F1_ENTRANCE: {
        id: "F1_ENTRANCE",
        name: "Gate 1 CCS Main Entrance",
        floor: 1,
        x: 100,
        y: 450,
        type: "entrance",
        category: "facility",
        description: "Main campus ingress gate and security checkpoint.",
        neighbors: [
          { nodeId: "F1_SECURITY", weight: 15 },
          { nodeId: "F1_MAIN_HALLWAY_1", weight: 35 },
        ],
      },
      F1_SECURITY: {
        id: "F1_SECURITY",
        name: "Campus Guard Desk",
        floor: 1,
        x: 120,
        y: 380,
        type: "facility",
        category: "facility",
        description: "Campus security assistance and visitor log.",
        neighbors: [
          { nodeId: "F1_ENTRANCE", weight: 15 },
          { nodeId: "F1_MAIN_HALLWAY_1", weight: 25 },
        ],
      },
      F1_MAIN_HALLWAY_1: {
        id: "F1_MAIN_HALLWAY_1",
        name: "Ground Lobby Hallway",
        floor: 1,
        x: 220,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Ground floor main access corridor.",
        neighbors: [
          { nodeId: "F1_ENTRANCE", weight: 35 },
          { nodeId: "F1_SECURITY", weight: 25 },
          { nodeId: "F1_MAC_LAB_101", weight: 30 },
          { nodeId: "F1_CANTEEN", weight: 45 },
          { nodeId: "F1_MAIN_HALLWAY_2", weight: 40 },
        ],
      },
      F1_MAC_LAB_101: {
        id: "F1_MAC_LAB_101",
        name: "CCS Mac Laboratory 101",
        floor: 1,
        x: 220,
        y: 260,
        type: "room",
        category: "lab",
        description: "Apple Macintosh workstation laboratory for iOS and multimedia development (Cap: 45).",
        neighbors: [{ nodeId: "F1_MAIN_HALLWAY_1", weight: 30 }],
      },
      F1_CANTEEN: {
        id: "F1_CANTEEN",
        name: "CCS Canteen & Refreshment Center",
        floor: 1,
        x: 100,
        y: 200,
        type: "facility",
        category: "amenity",
        description: "Campus cafeteria, snack counters, and student dining lounge.",
        neighbors: [{ nodeId: "F1_MAIN_HALLWAY_1", weight: 45 }],
      },
      F1_MAIN_HALLWAY_2: {
        id: "F1_MAIN_HALLWAY_2",
        name: "East Lobby Junction",
        floor: 1,
        x: 380,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Lobby junction connecting student affairs, stairs, and elevator.",
        neighbors: [
          { nodeId: "F1_MAIN_HALLWAY_1", weight: 40 },
          { nodeId: "F1_STUDENT_AFFAIRS", weight: 30 },
          { nodeId: "F1_RESTROOM", weight: 25 },
          { nodeId: "F1_STAIRS", weight: 35 },
          { nodeId: "F1_ELEVATOR", weight: 30 },
        ],
      },
      F1_STUDENT_AFFAIRS: {
        id: "F1_STUDENT_AFFAIRS",
        name: "Student Affairs & Helpdesk",
        floor: 1,
        x: 380,
        y: 260,
        type: "room",
        category: "office",
        description: "Student council office, document releases, and student counseling.",
        neighbors: [{ nodeId: "F1_MAIN_HALLWAY_2", weight: 30 }],
      },
      F1_RESTROOM: {
        id: "F1_RESTROOM",
        name: "Ground Floor Restrooms",
        floor: 1,
        x: 480,
        y: 500,
        type: "restroom",
        category: "amenity",
        description: "Male, female, and all-gender accessible restrooms.",
        neighbors: [{ nodeId: "F1_MAIN_HALLWAY_2", weight: 25 }],
      },
      F1_STAIRS: {
        id: "F1_STAIRS",
        name: "Central Staircase (Floor 1)",
        floor: 1,
        x: 480,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Central concrete staircase connecting Floors 1 through 5.",
        neighbors: [
          { nodeId: "F1_MAIN_HALLWAY_2", weight: 35 },
          { nodeId: "F2_STAIRS", weight: 50 },
        ],
      },
      F1_ELEVATOR: {
        id: "F1_ELEVATOR",
        name: "CCS Main Elevator (Floor 1)",
        floor: 1,
        x: 520,
        y: 450,
        type: "elevator",
        category: "facility",
        description: "High-capacity passenger elevator serving Floors 1 to 5.",
        neighbors: [
          { nodeId: "F1_MAIN_HALLWAY_2", weight: 30 },
          { nodeId: "F2_ELEVATOR", weight: 20 },
          { nodeId: "F3_ELEVATOR", weight: 40 },
          { nodeId: "F4_ELEVATOR", weight: 60 },
          { nodeId: "F5_ELEVATOR", weight: 80 },
        ],
      },

      // ==========================================
      // FLOOR 2: Computer Labs & Lecture Rooms
      // ==========================================
      F2_STAIRS: {
        id: "F2_STAIRS",
        name: "Central Staircase (Floor 2)",
        floor: 2,
        x: 480,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on the 2nd Floor.",
        neighbors: [
          { nodeId: "F1_STAIRS", weight: 50 },
          { nodeId: "F2_HALLWAY_1", weight: 35 },
          { nodeId: "F3_STAIRS", weight: 50 },
        ],
      },
      F2_ELEVATOR: {
        id: "F2_ELEVATOR",
        name: "CCS Main Elevator (Floor 2)",
        floor: 2,
        x: 520,
        y: 450,
        type: "elevator",
        category: "facility",
        description: "Elevator access point on the 2nd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 20 },
          { nodeId: "F2_HALLWAY_1", weight: 30 },
          { nodeId: "F3_ELEVATOR", weight: 20 },
          { nodeId: "F4_ELEVATOR", weight: 40 },
          { nodeId: "F5_ELEVATOR", weight: 60 },
        ],
      },
      F2_HALLWAY_1: {
        id: "F2_HALLWAY_1",
        name: "Floor 2 Main Corridor",
        floor: 2,
        x: 350,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Central corridor for programming laboratories.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 35 },
          { nodeId: "F2_ELEVATOR", weight: 30 },
          { nodeId: "F2_PROG_LAB_201", weight: 40 },
          { nodeId: "F2_HALLWAY_2", weight: 45 },
          { nodeId: "F2_FACULTY_ROOM", weight: 35 },
        ],
      },
      F2_PROG_LAB_201: {
        id: "F2_PROG_LAB_201",
        name: "Programming Lab 201 (CL2)",
        floor: 2,
        x: 350,
        y: 260,
        type: "room",
        category: "lab",
        description: "High-spec programming lab for Java, C++, and Python courses.",
        neighbors: [{ nodeId: "F2_HALLWAY_1", weight: 40 }],
      },
      F2_FACULTY_ROOM: {
        id: "F2_FACULTY_ROOM",
        name: "CCS Faculty Room 205",
        floor: 2,
        x: 480,
        y: 260,
        type: "room",
        category: "office",
        description: "Faculty consultation office and faculty departmental desks.",
        neighbors: [{ nodeId: "F2_HALLWAY_1", weight: 35 }],
      },
      F2_HALLWAY_2: {
        id: "F2_HALLWAY_2",
        name: "West Wing Corridor 2F",
        floor: 2,
        x: 180,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "West wing hallway leading to lecture halls.",
        neighbors: [
          { nodeId: "F2_HALLWAY_1", weight: 45 },
          { nodeId: "F2_LECTURE_202", weight: 35 },
          { nodeId: "F2_SYSTEMS_LAB_203", weight: 40 },
          { nodeId: "F2_RESTROOM", weight: 25 },
        ],
      },
      F2_LECTURE_202: {
        id: "F2_LECTURE_202",
        name: "Lecture Room 202 (LH2)",
        floor: 2,
        x: 180,
        y: 300,
        type: "room",
        category: "classroom",
        description: "General education and computer science lecture hall (Cap: 50).",
        neighbors: [{ nodeId: "F2_HALLWAY_2", weight: 35 }],
      },
      F2_SYSTEMS_LAB_203: {
        id: "F2_SYSTEMS_LAB_203",
        name: "Systems Analysis Lab 203",
        floor: 2,
        x: 100,
        y: 450,
        type: "room",
        category: "lab",
        description: "Specialized laboratory for database systems and ERP design.",
        neighbors: [{ nodeId: "F2_HALLWAY_2", weight: 40 }],
      },
      F2_RESTROOM: {
        id: "F2_RESTROOM",
        name: "Floor 2 Restrooms",
        floor: 2,
        x: 180,
        y: 530,
        type: "restroom",
        category: "amenity",
        description: "Restrooms for Floor 2 students and faculty.",
        neighbors: [{ nodeId: "F2_HALLWAY_2", weight: 25 }],
      },

      // ==========================================
      // FLOOR 3: Executive Offices & Specialized Labs
      // ==========================================
      F3_STAIRS: {
        id: "F3_STAIRS",
        name: "Central Staircase (Floor 3)",
        floor: 3,
        x: 480,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on Floor 3.",
        neighbors: [
          { nodeId: "F2_STAIRS", weight: 50 },
          { nodeId: "F3_HALLWAY_1", weight: 35 },
          { nodeId: "F4_STAIRS", weight: 50 },
        ],
      },
      F3_ELEVATOR: {
        id: "F3_ELEVATOR",
        name: "CCS Main Elevator (Floor 3)",
        floor: 3,
        x: 520,
        y: 450,
        type: "elevator",
        category: "facility",
        description: "Elevator access point on the 3rd Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 40 },
          { nodeId: "F2_ELEVATOR", weight: 20 },
          { nodeId: "F3_HALLWAY_1", weight: 30 },
          { nodeId: "F4_ELEVATOR", weight: 20 },
          { nodeId: "F5_ELEVATOR", weight: 40 },
        ],
      },
      F3_HALLWAY_1: {
        id: "F3_HALLWAY_1",
        name: "Floor 3 Executive Corridor",
        floor: 3,
        x: 350,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Executive corridor outside the Dean's Office suite.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 35 },
          { nodeId: "F3_ELEVATOR", weight: 30 },
          { nodeId: "F3_DEAN_OFFICE", weight: 45 },
          { nodeId: "F3_HALLWAY_2", weight: 40 },
          { nodeId: "F3_RESEARCH_LAB_303", weight: 35 },
        ],
      },
      F3_DEAN_OFFICE: {
        id: "F3_DEAN_OFFICE",
        name: "CCS Dean’s Office Suite",
        floor: 3,
        x: 350,
        y: 200,
        type: "room",
        category: "office",
        description: "Office of the Dean, CCS Academic Affairs & Administrative Staff.",
        neighbors: [{ nodeId: "F3_HALLWAY_1", weight: 45 }],
      },
      F3_RESEARCH_LAB_303: {
        id: "F3_RESEARCH_LAB_303",
        name: "Computer Research Lab 303",
        floor: 3,
        x: 480,
        y: 220,
        type: "room",
        category: "lab",
        description: "Postgraduate & thesis research lab equipped with compute workstations.",
        neighbors: [{ nodeId: "F3_HALLWAY_1", weight: 35 }],
      },
      F3_HALLWAY_2: {
        id: "F3_HALLWAY_2",
        name: "West Wing Corridor 3F",
        floor: 3,
        x: 180,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Access corridor for networking and software engineering labs.",
        neighbors: [
          { nodeId: "F3_HALLWAY_1", weight: 40 },
          { nodeId: "F3_NETWORK_LAB_301", weight: 35 },
          { nodeId: "F3_SOFT_ENG_LAB_302", weight: 40 },
          { nodeId: "F3_RESTROOM", weight: 25 },
        ],
      },
      F3_NETWORK_LAB_301: {
        id: "F3_NETWORK_LAB_301",
        name: "Cisco Networking Lab 301 (CL3)",
        floor: 3,
        x: 180,
        y: 280,
        type: "room",
        category: "lab",
        description: "Hands-on CCNA networking lab with rack-mounted routers and switches.",
        neighbors: [{ nodeId: "F3_HALLWAY_2", weight: 35 }],
      },
      F3_SOFT_ENG_LAB_302: {
        id: "F3_SOFT_ENG_LAB_302",
        name: "Software Engineering Lab 302 (CL5)",
        floor: 3,
        x: 90,
        y: 450,
        type: "room",
        category: "lab",
        description: "Collaborative software development studio with dual-display setups.",
        neighbors: [{ nodeId: "F3_HALLWAY_2", weight: 40 }],
      },
      F3_RESTROOM: {
        id: "F3_RESTROOM",
        name: "Floor 3 Restrooms",
        floor: 3,
        x: 180,
        y: 530,
        type: "restroom",
        category: "amenity",
        description: "Floor 3 executive and student restrooms.",
        neighbors: [{ nodeId: "F3_HALLWAY_2", weight: 25 }],
      },

      // ==========================================
      // FLOOR 4: Audio Visual Hall & Advanced Labs
      // ==========================================
      F4_STAIRS: {
        id: "F4_STAIRS",
        name: "Central Staircase (Floor 4)",
        floor: 4,
        x: 480,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Stairwell landing on the 4th Floor.",
        neighbors: [
          { nodeId: "F3_STAIRS", weight: 50 },
          { nodeId: "F4_HALLWAY_1", weight: 35 },
          { nodeId: "F5_STAIRS", weight: 50 },
        ],
      },
      F4_ELEVATOR: {
        id: "F4_ELEVATOR",
        name: "CCS Main Elevator (Floor 4)",
        floor: 4,
        x: 520,
        y: 450,
        type: "elevator",
        category: "facility",
        description: "Elevator access point on the 4th Floor.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 60 },
          { nodeId: "F2_ELEVATOR", weight: 40 },
          { nodeId: "F3_ELEVATOR", weight: 20 },
          { nodeId: "F4_HALLWAY_1", weight: 30 },
          { nodeId: "F5_ELEVATOR", weight: 20 },
        ],
      },
      F4_HALLWAY_1: {
        id: "F4_HALLWAY_1",
        name: "Floor 4 Grand Hallway",
        floor: 4,
        x: 350,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Grand foyer outside the Multipurpose AV Hall.",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 35 },
          { nodeId: "F4_ELEVATOR", weight: 30 },
          { nodeId: "F4_AV_HALL_401", weight: 45 },
          { nodeId: "F4_HALLWAY_2", weight: 40 },
          { nodeId: "F4_STUDENT_LOUNGE", weight: 35 },
        ],
      },
      F4_AV_HALL_401: {
        id: "F4_AV_HALL_401",
        name: "CCS Multipurpose AV Hall 401",
        floor: 4,
        x: 350,
        y: 220,
        type: "room",
        category: "classroom",
        description: "Acoustically-treated amphitheater for college conferences and hackathons (Cap: 180).",
        neighbors: [{ nodeId: "F4_HALLWAY_1", weight: 45 }],
      },
      F4_STUDENT_LOUNGE: {
        id: "F4_STUDENT_LOUNGE",
        name: "Senior Student Innovation Lounge",
        floor: 4,
        x: 480,
        y: 240,
        type: "facility",
        category: "amenity",
        description: "Quiet study lounge with charging hubs and whiteboards.",
        neighbors: [{ nodeId: "F4_HALLWAY_1", weight: 35 }],
      },
      F4_HALLWAY_2: {
        id: "F4_HALLWAY_2",
        name: "West Wing Corridor 4F",
        floor: 4,
        x: 180,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Access corridor for AI and Cybersecurity labs.",
        neighbors: [
          { nodeId: "F4_HALLWAY_1", weight: 40 },
          { nodeId: "F4_AI_LAB_402", weight: 35 },
          { nodeId: "F4_CYBERSEC_LAB_403", weight: 40 },
          { nodeId: "F4_RESTROOM", weight: 25 },
        ],
      },
      F4_AI_LAB_402: {
        id: "F4_AI_LAB_402",
        name: "AI & Data Science Lab 402",
        floor: 4,
        x: 180,
        y: 280,
        type: "room",
        category: "lab",
        description: "GPU compute cluster lab dedicated to deep learning and predictive analytics.",
        neighbors: [{ nodeId: "F4_HALLWAY_2", weight: 35 }],
      },
      F4_CYBERSEC_LAB_403: {
        id: "F4_CYBERSEC_LAB_403",
        name: "Cybersecurity Lab 403",
        floor: 4,
        x: 90,
        y: 450,
        type: "room",
        category: "lab",
        description: "Air-gapped lab for penetration testing and digital forensics.",
        neighbors: [{ nodeId: "F4_HALLWAY_2", weight: 40 }],
      },
      F4_RESTROOM: {
        id: "F4_RESTROOM",
        name: "Floor 4 Restrooms",
        floor: 4,
        x: 180,
        y: 530,
        type: "restroom",
        category: "amenity",
        description: "Floor 4 student restrooms.",
        neighbors: [{ nodeId: "F4_HALLWAY_2", weight: 25 }],
      },

      // ==========================================
      // FLOOR 5: Lecture Halls & Innovation Wing
      // ==========================================
      F5_STAIRS: {
        id: "F5_STAIRS",
        name: "Central Staircase (Floor 5)",
        floor: 5,
        x: 480,
        y: 380,
        type: "stairs",
        category: "facility",
        description: "Top floor staircase landing.",
        neighbors: [
          { nodeId: "F4_STAIRS", weight: 50 },
          { nodeId: "F5_HALLWAY_1", weight: 35 },
        ],
      },
      F5_ELEVATOR: {
        id: "F5_ELEVATOR",
        name: "CCS Main Elevator (Floor 5)",
        floor: 5,
        x: 520,
        y: 450,
        type: "elevator",
        category: "facility",
        description: "5th floor elevator vestibule.",
        neighbors: [
          { nodeId: "F1_ELEVATOR", weight: 80 },
          { nodeId: "F2_ELEVATOR", weight: 60 },
          { nodeId: "F3_ELEVATOR", weight: 40 },
          { nodeId: "F4_ELEVATOR", weight: 20 },
          { nodeId: "F5_HALLWAY_1", weight: 30 },
        ],
      },
      F5_HALLWAY_1: {
        id: "F5_HALLWAY_1",
        name: "Floor 5 Innovation Corridor",
        floor: 5,
        x: 350,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "Main corridor on the 5th floor connecting Lecture 538 and the conference hall.",
        neighbors: [
          { nodeId: "F5_STAIRS", weight: 35 },
          { nodeId: "F5_ELEVATOR", weight: 30 },
          { nodeId: "F5_LECTURE_538", weight: 45 },
          { nodeId: "F5_HALLWAY_2", weight: 40 },
          { nodeId: "F5_CONFERENCE_ROOM", weight: 35 },
        ],
      },
      F5_LECTURE_538: {
        id: "F5_LECTURE_538",
        name: "CCS Lecture Hall 538",
        floor: 5,
        x: 350,
        y: 220,
        type: "room",
        category: "classroom",
        description: "Premier 5th floor smart classroom equipped with interactive displays (Cap: 65).",
        neighbors: [{ nodeId: "F5_HALLWAY_1", weight: 45 }],
      },
      F5_CONFERENCE_ROOM: {
        id: "F5_CONFERENCE_ROOM",
        name: "CCS Executive Conference Suite",
        floor: 5,
        x: 480,
        y: 240,
        type: "room",
        category: "office",
        description: "Executive board room for faculty meetings and university thesis defenses.",
        neighbors: [{ nodeId: "F5_HALLWAY_1", weight: 35 }],
      },
      F5_HALLWAY_2: {
        id: "F5_HALLWAY_2",
        name: "West Wing Corridor 5F",
        floor: 5,
        x: 180,
        y: 450,
        type: "corridor",
        category: "facility",
        description: "5th floor west wing corridor connecting IoT and incubator labs.",
        neighbors: [
          { nodeId: "F5_HALLWAY_1", weight: 40 },
          { nodeId: "F5_INNOVATION_LAB_501", weight: 35 },
          { nodeId: "F5_NETWORKS_502", weight: 40 },
          { nodeId: "F5_RESTROOM", weight: 25 },
        ],
      },
      F5_INNOVATION_LAB_501: {
        id: "F5_INNOVATION_LAB_501",
        name: "Advanced Innovation Lab 501",
        floor: 5,
        x: 180,
        y: 280,
        type: "room",
        category: "lab",
        description: "Startup incubator and robotics prototyping lab with 3D printers and microcontrollers.",
        neighbors: [{ nodeId: "F5_HALLWAY_2", weight: 35 }],
      },
      F5_NETWORKS_502: {
        id: "F5_NETWORKS_502",
        name: "IoT & Cloud Systems Lab 502",
        floor: 5,
        x: 90,
        y: 450,
        type: "room",
        category: "lab",
        description: "Embedded systems and edge computing research facility.",
        neighbors: [{ nodeId: "F5_HALLWAY_2", weight: 40 }],
      },
      F5_RESTROOM: {
        id: "F5_RESTROOM",
        name: "Floor 5 Restrooms",
        floor: 5,
        x: 180,
        y: 530,
        type: "restroom",
        category: "amenity",
        description: "Floor 5 restrooms.",
        neighbors: [{ nodeId: "F5_HALLWAY_2", weight: 25 }],
      },
    };
  }
}

/**
 * Mapping table from user/schedule room codes to primary graph node IDs.
 */
export const ROOM_NODE_MAPPING: Record<string, string> = {
  // Floor 5
  "CCS 538": "F5_LECTURE_538",
  "538": "F5_LECTURE_538",
  "ROOM 538": "F5_LECTURE_538",
  "CCS 501": "F5_INNOVATION_LAB_501",
  "501": "F5_INNOVATION_LAB_501",
  "CCS 502": "F5_NETWORKS_502",
  "502": "F5_NETWORKS_502",
  "CONFERENCE ROOM": "F5_CONFERENCE_ROOM",

  // Floor 4
  "CCS 401": "F4_AV_HALL_401",
  "AV HALL 401": "F4_AV_HALL_401",
  "AV HALL": "F4_AV_HALL_401",
  "CCS 402": "F4_AI_LAB_402",
  "AI LAB": "F4_AI_LAB_402",
  "CCS 403": "F4_CYBERSEC_LAB_403",
  "CYBER LAB": "F4_CYBERSEC_LAB_403",
  "STUDENT LOUNGE": "F4_STUDENT_LOUNGE",

  // Floor 3
  "CCS 301": "F3_NETWORK_LAB_301",
  "CL3": "F3_NETWORK_LAB_301",
  "CISCO LAB": "F3_NETWORK_LAB_301",
  "CCS 302": "F3_SOFT_ENG_LAB_302",
  "CL5": "F3_SOFT_ENG_LAB_302",
  "CCS 303": "F3_RESEARCH_LAB_303",
  "DEAN'S OFFICE": "F3_DEAN_OFFICE",
  "DEANS OFFICE": "F3_DEAN_OFFICE",

  // Floor 2
  "CCS 201": "F2_PROG_LAB_201",
  "CL2": "F2_PROG_LAB_201",
  "ROOM 201": "F2_PROG_LAB_201",
  "PROG LAB 201": "F2_PROG_LAB_201",
  "CCS 202": "F2_LECTURE_202",
  "ROOM 202": "F2_LECTURE_202",
  "LH2": "F2_LECTURE_202",
  "CCS 203": "F2_SYSTEMS_LAB_203",
  "FACULTY 205": "F2_FACULTY_ROOM",
  "FACULTY ROOM": "F2_FACULTY_ROOM",

  // Floor 1
  "MAC LAB 101": "F1_MAC_LAB_101",
  "MAC LAB": "F1_MAC_LAB_101",
  "CL1": "F1_MAC_LAB_101",
  "CANTEEN": "F1_CANTEEN",
  "STUDENT AFFAIRS": "F1_STUDENT_AFFAIRS",
  "ENTRANCE": "F1_ENTRANCE",
  "MAIN ENTRANCE": "F1_ENTRANCE",
  "SECURITY": "F1_SECURITY",
};

/**
 * Resolves a room code string into a valid graph node ID.
 */
export function getGraphNodeForRoom(roomCode: string): string {
  if (!roomCode) return "F5_LECTURE_538";
  const upperRoom = roomCode.toUpperCase().trim();
  return ROOM_NODE_MAPPING[upperRoom] || "F5_LECTURE_538";
}
