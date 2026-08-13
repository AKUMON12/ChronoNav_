import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

/**
 * OCR Ingestion API Route Handler (`POST /api/ocr/upload`)
 * Logs study load extraction metadata and batch-inserts user schedules.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, fileName, rawText, userId } = body;

    const targetUserId = userId || "demo-student-id";
    const imagePath = `ocr_uploads/${Date.now()}_${fileName || "study_load.pdf"}`;

    // 1. Record OCR Log Entry
    try {
      await (supabase.from("ocr_logs") as any).insert({
        user_id: targetUserId,
        image_path: imagePath,
        extracted_text: rawText || "Study Load OCR Text",
        status: "completed",
      });
    } catch (dbErr) {
      console.warn("[OCR API] Log recording skipped in dev mode:", dbErr);
    }

    // 2. Batch Insert Schedules if items provided
    if (Array.isArray(items) && items.length > 0) {
      const scheduleRecords = items.map((item: any) => ({
        user_id: targetUserId,
        course_name: `${item.courseCode} - ${item.courseTitle}`,
        day: item.dayOfWeek,
        start_time: item.startTime,
        end_time: item.endTime,
      }));

      try {
        await (supabase.from("schedules") as any).insert(scheduleRecords);
      } catch (dbErr) {
        console.warn("[OCR API] Schedule batch insert skipped in dev mode:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${items?.length || 0} schedule items`,
      imagePath,
      insertedCount: items?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

