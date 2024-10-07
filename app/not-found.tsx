import { EmptyResult } from "@/components";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <EmptyResult text="Page not found" />
    </div>
  );
}
