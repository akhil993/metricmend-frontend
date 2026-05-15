"use client";

import { useEffect, useState } from "react";
import { Orbit } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import {
    getCertifiedMetrics,
    getCertifiedModels,
} from "@/lib/api/certifications";

import { useGovernanceLineage } from "../hooks/useGovernanceLineage";
import { useGovernanceDeployments } from "../hooks/useGovernanceDeployments";

import DeploymentLineageTimeline from "./DeploymentLineageTimeline";
import LineageAssetDetails from "./LineageAssetDetails";
import LineageAssetSelector from "./LineageAssetSelector";
import SemanticLineageGraph from "./SemanticLineageGraph";

export default function GovernanceLineagePage() {
    const { activeWorkspace } = useAppWorkspace();
    const workspaceId = activeWorkspace?.workspace_id;

    const [certifiedMetrics, setCertifiedMetrics] =
        useState<any[]>([]);

    const [certifiedModels, setCertifiedModels] =
        useState<any[]>([]);

    const [selectedAsset, setSelectedAsset] =
        useState<{
            entityType: "metric" | "model";
            entityId: string;
        } | null>(null);

    const { lineage, loading } = useGovernanceLineage(
        selectedAsset?.entityType,
        selectedAsset?.entityId
    );
    const { deployments } = useGovernanceDeployments(
        workspaceId
    );

    useEffect(() => {
        async function loadCertifiedAssets() {
            if (!workspaceId) return;

            try {
                const [metrics, models] = await Promise.all([
                    getCertifiedMetrics(workspaceId),
                    getCertifiedModels(workspaceId),
                ]);

                setCertifiedMetrics(metrics);
                setCertifiedModels(models);
            } catch (error) {
                console.error(error);
            }
        }

        loadCertifiedAssets();
    }, [workspaceId]);

    return (
        <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-indigo-500/10 p-3">
                        <Orbit className="h-6 w-6 text-indigo-500" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                            Governance Lineage
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Trace semantic dependencies, deployment flows,
                            governance approvals, and certification history.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr_360px]">
                <LineageAssetSelector
                    metrics={certifiedMetrics}
                    models={certifiedModels}
                    selectedAsset={selectedAsset}
                    onSelect={setSelectedAsset}
                />

                <SemanticLineageGraph />

                <LineageAssetDetails
                    lineage={lineage}
                    loading={loading}
                    selectedAsset={selectedAsset}
                />
            </div>

            <DeploymentLineageTimeline
                deployments={deployments}
            />
        </div>
    );
}