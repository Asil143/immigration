import { redirect } from "next/navigation";

// Jobs page removed — employer lookup is the immigration-specific alternative
export default function JobsPage() {
  redirect("/employer-lookup");
}
