import type { TechMeldSubmissionType } from "@/types/techmeld";
import { clampText } from "./sanitize";
import { getServiceSupabaseClient } from "./supabase/service-client";
import { isValidExternalUrl } from "./validate-url";

const VALID_TYPES: TechMeldSubmissionType[] = [
  "event",
  "article",
  "tool",
  "learning_resource",
  "hackathon",
  "meetup",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmissionInput {
  submissionType: string;
  title: string;
  sourceUrl: string;
  description?: string;
  submittedByName?: string;
  submittedByEmail?: string;
  /** Hidden form field — a real visitor never fills it in. */
  honeypot?: string;
}

export interface ValidatedSubmission {
  submissionType: TechMeldSubmissionType;
  title: string;
  sourceUrl: string;
  description: string | null;
  submittedByName: string | null;
  submittedByEmail: string | null;
}

export function validateSubmissionInput(
  input: SubmissionInput
): ValidatedSubmission | { error: string } {
  if (input.honeypot) {
    return { error: "Submission rejected." };
  }

  if (!VALID_TYPES.includes(input.submissionType as TechMeldSubmissionType)) {
    return { error: "Choose a valid submission type." };
  }

  const title = input.title?.trim();
  if (!title || title.length > 300) {
    return { error: "Enter a title (up to 300 characters)." };
  }

  const sourceUrl = input.sourceUrl?.trim();
  if (!sourceUrl || !isValidExternalUrl(sourceUrl)) {
    return { error: "Enter a valid source URL starting with http:// or https://." };
  }

  const email = input.submittedByEmail?.trim();
  if (email && !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address, or leave it blank." };
  }

  return {
    submissionType: input.submissionType as TechMeldSubmissionType,
    title: clampText(title, 300),
    sourceUrl,
    description: input.description?.trim() ? clampText(input.description.trim(), 1000) : null,
    submittedByName: input.submittedByName?.trim().slice(0, 200) || null,
    submittedByEmail: email || null,
  };
}

export type SubmissionOutcome =
  | { status: "submitted" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

export async function submitCommunityEntry(input: SubmissionInput): Promise<SubmissionOutcome> {
  const validated = validateSubmissionInput(input);
  if ("error" in validated) {
    return { status: "invalid", message: validated.error };
  }

  const client = getServiceSupabaseClient();
  if (!client) {
    return { status: "error", message: "Submissions are not configured yet." };
  }

  const { error } = await client.from("techmeld_editorial_submissions").insert({
    submission_type: validated.submissionType,
    submitted_by_name: validated.submittedByName,
    submitted_by_email: validated.submittedByEmail,
    title: validated.title,
    source_url: validated.sourceUrl,
    description: validated.description,
    status: "pending",
  });

  if (error) return { status: "error", message: "Could not save your submission." };
  return { status: "submitted" };
}
