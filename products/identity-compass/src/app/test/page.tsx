import type { Metadata } from "next";
import { TestClient } from "@/components/TestClient";

export const metadata: Metadata = { title: "التقييم" };

export default function TestPage() {
  return <TestClient />;
}
