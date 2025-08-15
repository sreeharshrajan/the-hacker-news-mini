import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="p-4 flex items-center gap-2">
      <Loader className="animate-spin" />
      Fetching story…
    </div>
  );
}