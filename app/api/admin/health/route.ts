import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";
import {
  checkEnvVars, checkStripe, checkStalePendingOrders,
  checkResend, checkTurso, checkApiUsage,
} from "@/lib/health-checks";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!session || session !== sessionToken()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [envVars, stripeCheck, stalePending, resendCheck, tursoCheck, apiUsage] = await Promise.all([
    Promise.resolve(checkEnvVars()),
    checkStripe(),
    checkStalePendingOrders(),
    checkResend(),
    checkTurso(),
    checkApiUsage(),
  ]);

  return NextResponse.json({
    envVars,
    webhookHealth: { stripe: stripeCheck, stalePending, resend: resendCheck, turso: tursoCheck },
    apiUsage,
    checkedAt: new Date().toISOString(),
  });
}
