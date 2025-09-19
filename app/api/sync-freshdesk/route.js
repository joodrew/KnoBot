import { syncFreshdeskTickets } from "@/services/syncFreshdesk";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const validateStatusParam = searchParams.get("validateStatus");

  const validateStatus = validateStatusParam !== "false"; // default: true

  const result = await syncFreshdeskTickets({ validateStatus });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
