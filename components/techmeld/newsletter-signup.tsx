"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";

const interests = [
  "AI",
  "Cloud",
  "Analytics",
  "Data Engineering",
  "Software Development",
  "Events",
  "Learning",
];

type FormState = "idle" | "submitting" | "subscribed" | "already_subscribed" | "invalid" | "error";

export function NewsletterSignup() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const firstName = String(form.get("firstName") ?? "");
    const selectedInterests = form.getAll("interests").map(String);
    const honeypot = String(form.get("company") ?? "");

    try {
      const response = await fetch("/api/techmeld/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, interests: selectedInterests, honeypot }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.status === "subscribed") {
        setState("subscribed");
      } else if (response.status === 200 && data?.status === "already_subscribed") {
        setState("already_subscribed");
      } else if (response.status === 400) {
        setState("invalid");
        setMessage(data?.message ?? "Enter a valid email address.");
      } else {
        setState("error");
        setMessage(data?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  if (state === "subscribed" || state === "already_subscribed") {
    return (
      <section className="techmeld-newsletter">
        <div className="techmeld-newsletter-copy">
          <div className="techmeld-newsletter-icon">
            <Mail />
          </div>
          <p className="eyebrow">Stay in the Meld</p>
          <h2>A useful technology roundup, without the noise.</h2>
        </div>

        <div className="techmeld-newsletter-success" role="status">
          <CheckCircle2 />
          <h3>{state === "subscribed" ? "Thanks for joining." : "You're already subscribed."}</h3>
          <p>
            {state === "subscribed"
              ? "You're on the list. We'll only send what's genuinely useful."
              : "This email is already on the TechMeld list — no action needed."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="techmeld-newsletter">
      <div className="techmeld-newsletter-copy">
        <div className="techmeld-newsletter-icon">
          <Mail />
        </div>
        <p className="eyebrow">Stay in the Meld</p>
        <h2>A useful technology roundup, without the noise.</h2>
        <p>
          Get a concise weekly roundup of important technology news, upcoming
          events, product releases, and learning opportunities.
        </p>
      </div>

      <form className="techmeld-newsletter-form" onSubmit={handleSubmit}>
        <label>
          First name <span>(optional)</span>
          <input name="firstName" autoComplete="given-name" disabled={state === "submitting"} />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            disabled={state === "submitting"}
            aria-invalid={state === "invalid"}
          />
        </label>

        <input
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="techmeld-honeypot"
          aria-hidden="true"
        />

        <fieldset>
          <legend>Topics you are interested in</legend>

          <div className="techmeld-interest-grid">
            {interests.map((interest) => (
              <label key={interest} className="techmeld-checkbox">
                <input type="checkbox" name="interests" value={interest} disabled={state === "submitting"} />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {state === "invalid" || state === "error" ? (
          <p className="techmeld-form-error" role="alert">
            <AlertCircle size={15} />
            {message}
          </p>
        ) : null}

        <button type="submit" className="primary-button" disabled={state === "submitting"}>
          {state === "submitting" ? "Joining…" : "Join TechMeld"}
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}
