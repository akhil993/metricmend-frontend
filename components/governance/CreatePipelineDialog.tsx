"use client";

import { useEffect, useState } from "react";

import {
    createWorkspacePipeline,
    getCompanyWorkspaces,
    type WorkspaceOption,
} from "@/lib/api/governance";

import { PipelineWorkspaceSelector } from "./PipelineWorkspaceSelector";

type CreatePipelineDialogProps = {
    companyId: string;

};

export function CreatePipelineDialog({
    companyId,

}: CreatePipelineDialogProps) {
    const [workspaces, setWorkspaces] = useState<
        WorkspaceOption[]
    >([]);

    const [sourceWorkspaceId, setSourceWorkspaceId] =
        useState("");

    const [targetWorkspaceId, setTargetWorkspaceId] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [success, setSuccess] =
        useState(false);

    useEffect(() => {
        async function loadWorkspaces() {
            try {
                const response = await getCompanyWorkspaces(companyId);

                setWorkspaces(response);
            } catch (error) {
                console.error(error);
            }
        }

        loadWorkspaces();
    }, [companyId]);

    async function handleCreatePipeline() {
        try {
            setIsSubmitting(true);

            await createWorkspacePipeline({
                company_id: companyId,
                source_workspace_id: sourceWorkspaceId,
                target_workspace_id: targetWorkspaceId,
            });

            setSuccess(true);

            setSourceWorkspaceId("");
            setTargetWorkspaceId("");
        } catch (error) {
            console.error(error);

            alert(
                "Failed to create deployment pipeline."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
            <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                    Create deployment pipeline
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Configure governed promotion
                    paths between semantic
                    environments.
                </p>
            </div>

            <div className="mt-6 grid gap-5">
                <PipelineWorkspaceSelector
                    label="Source workspace"
                    value={sourceWorkspaceId}
                    onChange={
                        setSourceWorkspaceId
                    }
                    workspaces={workspaces}
                />

                <PipelineWorkspaceSelector
                    label="Target workspace"
                    value={targetWorkspaceId}
                    onChange={
                        setTargetWorkspaceId
                    }
                    workspaces={workspaces}
                />
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button
                    onClick={
                        handleCreatePipeline
                    }
                    disabled={
                        isSubmitting ||
                        !sourceWorkspaceId ||
                        !targetWorkspaceId
                    }
                    className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Creating..."
                        : "Create pipeline"}
                </button>

                {success && (
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        Pipeline created.
                    </span>
                )}
            </div>
        </div>
    );
}