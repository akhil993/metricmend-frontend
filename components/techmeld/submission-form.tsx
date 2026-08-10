"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const SUBMISSION_TYPES = [
  { value: "event", label: "Event" },
  { value: "article", label: "Article" },
  { value: "tool", label: "Tool" },
  { value: "learning_resource", label: "Learning resource" },
  { value: "hackathon", label: "Hackathon" },
  { value: "meetup", label: "Meetup" },
];

type FormState = "idle" | "submitting" | "submitted" | "invalid" | "error";

export function SubmissionForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/techmeld/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: String(form.get("submissionType") ?? ""),
          title: String(form.get("title") ?? ""),
          sourceUrl: String(form.get("sourceUrl") ?? ""),
          description: String(form.get("description") ?? ""),
          submittedByName: String(form.get("submittedByName") ?? ""),
          submittedByEmail: String(form.get("submittedByEmail") ?? ""),
          honeypot: String(form.get("company") ?? ""),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.status === "submitted") {
        setState("submitted");
      } else if (response.status === 400) {
        setState("invalid");
        setMessage(data?.message ?? "Check the form and try again.");
      } else {
        setState("error");
        setMessage(data?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  if (state === "submitted") {
    return (
      <div className="techmeld-newsletter-success" role="status">
        <CheckCircle2 />
        <h3>Thanks for the suggestion.</h3>
        <p>
          Every submission is reviewed by an editor before it appears on
          TechMeld. We won&apos;t publish it automatically.
        </p>
      </div>
    );
  }

  return (
    <form className="techmeld-submission-form" onSubmit={handleSubmit}>
      <label>
        What are you submitting?
        <select name="submissionType" required disabled={state === "submitting"} defaultValue="">
          <option value="" disabled>
            Choose a type
          </option>
          {SUBMISSION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Title
        <input name="title" required maxLength={300} disabled={state === "submitting"} />
      </label>

      <label>
        Source URL
        <input
          name="sourceUrl"
          type="url"
          required
          placeholder="https://"
          disabled={state === "submitting"}
        />
      </label>

      <label>
        Description <span>(optional)</span>
        <textarea name="description" rows={4} maxLength={1000} disabled={state === "submitting"} />
      </label>

      <div className="techmeld-form-row">
        <label>
          Your name <span>(optional)</span>
          <input name="submittedByName" disabled={state === "submitting"} />
        </label>

        <label>
          Your email <span>(optional)</span>
          <input name="submittedByEmail" type="email" disabled={state === "submitting"} />
        </label>
      </div>

      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="techmeld-honeypot"
        aria-hidden="true"
      />

      {state === "invalid" || state === "error" ? (
        <p className="techmeld-form-error" role="alert">
          <AlertCircle size={15} />
          {message}
        </p>
      ) : null}

      <button type="submit" className="primary-button" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting…" : "Submit for review"}
        <ArrowRight size={17} />
      </button>

      <small>Every submission is reviewed by an editor before it goes live.</small>
    </form>
  );
}
