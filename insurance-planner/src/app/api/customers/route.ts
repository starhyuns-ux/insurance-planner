import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 서버사이드에서 Supabase 클라이언트 생성
// → 브라우저 auth lock 문제(React Strict Mode) 완전 우회
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const gender = searchParams.get("gender") || "";

    let query = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (gender && (gender === "male" || gender === "female")) {
      query = query.eq("gender", gender);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET customers error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, gender, birth_date } = body;

    // 필수값 검증
    if (!name || !phone || !gender || !birth_date) {
      return NextResponse.json(
        { error: "이름, 연락처, 성별, 생년월일은 필수 항목입니다." },
        { status: 422 }
      );
    }

    // customers 테이블 스키마(id, name, phone, gender, birth_date, created_at)에
    // 맞는 필드만 전송 → 400 Bad Request 오류 해결
    const { data, error } = await supabase
      .from("customers")
      .insert([{ name, phone, gender, birth_date }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
