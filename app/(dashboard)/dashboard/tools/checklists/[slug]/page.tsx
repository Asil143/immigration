import { notFound } from "next/navigation";
import { checklistMap } from "@/lib/checklists";
import { ChecklistView } from "@/components/checklists/checklist-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(checklistMap).map(slug => ({ slug }));
}

export default async function ChecklistPage({ params }: Props) {
  const { slug } = await params;
  const checklist = checklistMap[slug];

  if (!checklist) notFound();

  return (
    <div className="p-8">
      <ChecklistView
        checklist={checklist}
        storageKey={`visapilot_checklist_${slug}`}
      />
    </div>
  );
}
