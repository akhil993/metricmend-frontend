"use client";

import { useParams } from "next/navigation";
import MetricsShell from "@/components/metrics/MetricsShell";

export default function ModelMetricsPage() {
  const params = useParams();

  const modelId = params.modelId as string;

  return <MetricsShell modelId={modelId} />;
}