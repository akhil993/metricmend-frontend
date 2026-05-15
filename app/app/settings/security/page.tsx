import {
  KeyRound,
  Lock,
  Shield,
  Users,
} from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          <Shield className="h-4 w-4" />
          Security
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Security & governance
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Manage organization access governance, authentication
          readiness, admin controls, and enterprise security posture.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SecurityCard
          icon={Users}
          title="Role-based access"
          status="Active"
          description="Company owners/admins manage team roles and governed access through Team settings."
        />

        <SecurityCard
          icon={Lock}
          title="Workspace isolation"
          status="Active"
          description="Workspaces isolate connections, semantic models, metrics, Mira chats, and governed analytics assets."
        />

        <SecurityCard
          icon={Shield}
          title="SSO readiness"
          status="Planned"
          description="SAML, Azure AD, Okta, Google Workspace, and SCIM controls can be added here later."
        />

        <SecurityCard
          icon={KeyRound}
          title="Service access"
          status="Planned"
          description="Future API keys, service accounts, and machine-to-machine access controls belong here."
        />
      </div>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  status,
  description,
}: {
  icon: React.ElementType;
  title: string;
  status: "Active" | "Planned";
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
              : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}