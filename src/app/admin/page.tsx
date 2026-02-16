import { GenerateTagsView } from "@/features/admin/views/GenerateTagsView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <GenerateTagsView count={50} />
    </ProtectedRoute>
  );
}