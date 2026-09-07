import { NextResponse } from "next/server";
import { hasFullAccess } from "@/lib/access";
import { currentUser } from "@/lib/supabase/server";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ unlocked: false }, { status: 401 });
  return NextResponse.json({ unlocked: await hasFullAccess(id) });
}
