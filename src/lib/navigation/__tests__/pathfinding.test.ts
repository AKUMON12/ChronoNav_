import { describe, it, expect } from "vitest";
import { findShortestPath, SampleCCSGraph } from "../pathfinding";

describe("ChronoNav 8-Floor Campus Dijkstra Pathfinding Engine", () => {
  const graph = SampleCCSGraph.getSampleGraph();

  it("should calculate multi-floor shortest path from Gate 1 (Floor 1) to CCS Lecture 538 (Floor 5)", () => {
    const result = findShortestPath(graph, "F1_GATE1", "F5_LECTURE_538");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds[0]).toBe("F1_GATE1");
    expect(result.pathNodeIds[result.pathNodeIds.length - 1]).toBe("F5_LECTURE_538");
    expect(result.totalDistance).toBeGreaterThan(0);
    expect(result.floorsTraversed).toContain(1);
    expect(result.floorsTraversed).toContain(5);
    expect(result.instructions.length).toBeGreaterThan(3);
  });

  it("should calculate route from Ground Floor to HRM Kitchen Lab on Floor 6", () => {
    const result = findShortestPath(graph, "F1_GATE2", "F6_KITCHEN_LAB_1");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds[0]).toBe("F1_GATE2");
    expect(result.pathNodeIds[result.pathNodeIds.length - 1]).toBe("F6_KITCHEN_LAB_1");
    expect(result.floorsTraversed).toContain(6);
  });

  it("should support direct elevator transitions across Mezzanine and upper floors", () => {
    const result = findShortestPath(graph, "FM_CTE_DEAN", "F7_ROOF_DECK_GYM");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.floorsTraversed).toContain("M");
    expect(result.floorsTraversed).toContain(7);
  });

  it("should handle same-node origin and target gracefully", () => {
    const result = findShortestPath(graph, "F1_GATE1", "F1_GATE1");

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.pathNodeIds).toEqual(["F1_GATE1"]);
    expect(result.totalDistance).toBe(0);
    expect(result.waypoints.length).toBe(1);
  });

  it("should return null for invalid or non-existent node IDs", () => {
    const result = findShortestPath(graph, "INVALID_ORIGIN", "F5_LECTURE_538");
    expect(result).toBeNull();
  });
});
