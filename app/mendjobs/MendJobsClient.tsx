"use client";

import { useMemo, useState } from "react";

type CompanySingle = {
  id: string;
  name: string;
  source_slug?: string;
};

type Job = {
  id: string;
  title: string;
  location: string | null;
  department: string | null;
  category?: string | null;
  apply_url: string;
  visa_signal: string;
  work_mode: string;
  source: string;
  companies: CompanySingle | CompanySingle[] | null;
};

type Comment = {
  id: string;
  comment: string;
  display_name: string | null;
  created_at: string;
  companies: CompanySingle | CompanySingle[] | null;
};

function getCompany(company: CompanySingle | CompanySingle[] | null) {
  if (Array.isArray(company)) return company[0] || null;
  return company;
}

function visaLabel(value: string) {
  const labels: Record<string, string> = {
    sponsorship_possible: "Sponsorship possible",
    no_sponsorship: "No sponsorship",
    usc_gc_likely: "USC/GC likely",
    unclear: "Sponsorship unclear",
  };

  return labels[value] || "Sponsorship unclear";
}

function categoryFromJob(job: Job) {
  return job.category || "Other";
}

export default function MendJobsClient({
  jobs,
  comments,
}: {
  jobs: Job[];
  comments: Comment[];
}) {
  const [query, setQuery] = useState("");
  const [visa, setVisa] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [companyId, setCompanyId] = useState("");
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  const companies = useMemo(() => {
    const map = new Map<string, string>();

    jobs.forEach((job) => {
      const company = getCompany(job.companies);
      if (company?.id) map.set(company.id, company.name);
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [jobs]);

  const categories = useMemo(() => {
    return Array.from(new Set(jobs.map(categoryFromJob)))
      .filter(Boolean)
      .sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = getCompany(job.companies);
      const category = categoryFromJob(job);
      const text =
        `${job.title} ${job.location} ${job.department} ${category} ${company?.name}`.toLowerCase();

      return (
        (!query || text.includes(query.toLowerCase())) &&
        (visa === "all" || job.visa_signal === visa) &&
        (workMode === "all" || job.work_mode === workMode) &&
        (companyFilter === "all" || company?.id === companyFilter) &&
        (categoryFilter === "all" || category === categoryFilter)
      );
    });
  }, [jobs, query, visa, workMode, companyFilter, categoryFilter]);

  async function postComment() {
    setMessage("");

    const response = await fetch("/api/mendjobs/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        comment,
        display_name: displayName,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.message || payload.error || "Unable to post comment.");
      return;
    }

    setMessage("Comment posted successfully.");
    setComment("");
    setDisplayName("");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-5 py-10 text-[#171411]">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <p className="mb-4 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
            MendJobs by MetricMend
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Real jobs with sponsorship clarity.
          </h1>

          <p className="mt-5 max-w-2xl text-neutral-700">
            Search real company career postings across data, analytics, BI,
            software, AI, and product roles.
          </p>

          <p className="mt-4 text-sm text-neutral-500">
            Showing {filteredJobs.length} of {jobs.length} live roles.
          </p>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search role, company, location..."
              className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none md:col-span-2"
            />

            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none"
            >
              <option value="all">All companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={visa}
              onChange={(e) => setVisa(e.target.value)}
              className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none"
            >
              <option value="all">All visa signals</option>
              <option value="sponsorship_possible">Sponsorship possible</option>
              <option value="no_sponsorship">No sponsorship</option>
              <option value="usc_gc_likely">USC/GC likely</option>
              <option value="unclear">Sponsorship unclear</option>
            </select>

            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none md:col-span-1"
            >
              <option value="all">All work modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4">
            {filteredJobs.map((job) => {
              const company = getCompany(job.companies);
              const category = categoryFromJob(job);

              return (
                <article
                  key={job.id}
                  className="rounded-3xl border border-black/10 bg-[#fbfaf7] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{job.title}</h2>
                      <p className="mt-1 text-neutral-700">
                        {company?.name || "Unknown company"} ·{" "}
                        {job.location || "Location not listed"}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600">
                        {category} · {job.department || "Department not listed"} · Source:{" "}
                        {job.source}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        {visaLabel(job.visa_signal)}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                        {job.work_mode}
                      </span>
                    </div>
                  </div>

                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full bg-black px-5 py-2 text-sm font-semibold text-white"
                  >
                    Apply on company site
                  </a>
                </article>
              );
            })}

            {!filteredJobs.length && (
              <div className="rounded-3xl border border-dashed border-black/20 p-8 text-center text-neutral-600">
                No matching jobs found. Try clearing filters or searching a broader role.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Community experiences</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Share sponsorship, interview, and recruiter experiences.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl border border-black/10 bg-[#fbfaf7] p-5">
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>

              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name, optional"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
              />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Example: Recruiter confirmed H1B transfer support."
                className="mt-3 min-h-32 w-full rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none"
              />

              {message && (
                <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                  {message}
                </div>
              )}

              <button
                onClick={postComment}
                className="mt-4 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Post experience
              </button>
            </div>

            <div className="grid gap-3">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-black/10 bg-[#fbfaf7] p-5"
                >
                  <p className="text-sm font-semibold">
                    {getCompany(item.companies)?.name || "Unknown company"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {item.display_name || "Anonymous"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {item.comment}
                  </p>
                </div>
              ))}

              {!comments.length && (
                <div className="rounded-3xl border border-dashed border-black/20 p-8 text-center text-neutral-600">
                  No community posts yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="rounded-[2rem] border border-black/10 bg-white/70 p-6 text-sm leading-6 text-neutral-600">
          <p className="font-semibold text-neutral-900">MendJobs community policy</p>
          <p className="mt-2">
            MendJobs is designed to be a respectful, neutral space for job seekers.
            Comments may be reviewed before posting. Content involving harassment,
            hate, racism, discrimination, threats, abuse, doxxing, or personal attacks
            may be blocked or removed.
          </p>
          <p className="mt-2">
            Sponsorship labels are informational signals, not guarantees. Always confirm
            visa, work authorization, and sponsorship details directly with the employer.
          </p>
        </footer>
      </div>
    </main>
  );
}
