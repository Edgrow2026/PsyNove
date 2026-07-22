import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("payment_transactions")
    .select("order_id, payment_id, status, status_code, status_message")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to retrieve payment" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
