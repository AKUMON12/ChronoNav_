import { describe, it, expect } from "vitest";
import { findShortestPath, SampleCCSGraph } from "../pathfinding";

describe("ChronoNav Dijkstra Pathfinding Engine", () => {
  const graph = SampleCCSGraph.getSampleGraph();

  it("should calculate the shortest path between Entrance (Floor 1) and Dean's Office (Floor 3)", () => {
    const result = findShortestPath(graph, "F1_ENTRANCE", "F3_DEAN_OFFICE");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds[0]).toBe("F1_ENTRANCE");
    expect(result.pathNodeIds[result.pathNodeIds.length - 1]).toBe("F3_DEAN_OFFICE");
    expect(result.totalDistance).toBeGreaterThan(0);
    expect(result.floorsTraversed).toEqual([1, 2, 3]);
    expect(result.instructions.length).toBeGreaterThan(2);
  });

  it("should support direct elevator pathfinding from Floor 1 to Floor 4", () => {
    const result = findShortestPath(graph, "F1_ELEVATOR", "F4_AV_HALL_401");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds).toContain("F4_ELEVATOR");
    expect(result.floorsTraversed).toContain(4);
  });

  it("should handle same-node start and target gracefully", () => {
    const result = findShortestPath(graph, "F1_ENTRANCE", "F1_ENTRANCE");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds).toEqual(["F1_ENTRANCE"]);
    expect(result.totalDistance).toBe(0);
    expect(result.waypoints.length).toBe(1);
  });

  it("should return null for invalid or unreachable node IDs", () => {
    const result = findShortestPath(graph, "INVALID_START", "F3_DEAN_OFFICE");
    expect(result).toBeNull();
  });
});
