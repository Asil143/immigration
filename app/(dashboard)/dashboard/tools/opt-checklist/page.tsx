import { redirect } from "next/navigation";

// This route is deprecated — canonical checklist is at /dashboard/tools/checklists
export default function OldOptChecklistPage() {
  redirect("/dashboard/tools/checklists");
}
