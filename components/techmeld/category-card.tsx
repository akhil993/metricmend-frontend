import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  GraduationCap,
  Rocket,
  Users,
  Wrench,
} from "lucide-react";
import type { TechMeldCategory } from "@/types/techmeld";

const icons = {
  brain: BrainCircuit,
  calendar: CalendarDays,
  rocket: Rocket,
  graduation: GraduationCap,
  wrench: Wrench,
  users: Users,
};

export function CategoryCard({
  category,
}: {
  category: TechMeldCategory;
}) {
  const Icon = icons[category.icon];

  return (
    <article className="techmeld-category-card">
      <div className="techmeld-card-icon">
        <Icon />
      </div>

      <div className="techmeld-category-count">
        {category.itemCount} {category.itemCount === 1 ? "listing" : "listings"}
      </div>

      <h3>{category.title}</h3>
      <p>{category.description}</p>

      <Link href={category.href}>
        Explore
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
