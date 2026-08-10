import Link from "next/link";
import { ArrowRight, BarChart3, Heart } from "lucide-react";

type ProductDiscoveryCardProps = {
  product: "lifemeld" | "metricmend";
};

export function ProductDiscoveryCard({
  product,
}: ProductDiscoveryCardProps) {
  const isLifeMeld = product === "lifemeld";

  return (
    <aside
      className={`techmeld-product-discovery ${
        isLifeMeld ? "is-lifemeld" : "is-metricmend"
      }`}
    >
      <div className="techmeld-product-icon">
        {isLifeMeld ? <Heart /> : <BarChart3 />}
      </div>

      <div>
        <span>Related MetricMend AI product</span>
        <h3>
          {isLifeMeld
            ? "Organize plans and life projects with LifeMeld."
            : "Explore business insights with InsightMend."}
        </h3>
      </div>

      {isLifeMeld ? (
        <a href="https://www.lifemeldai.com" target="_blank" rel="noopener noreferrer">
          Explore
          <ArrowRight size={16} />
        </a>
      ) : (
        <Link href="/products">
          Explore
          <ArrowRight size={16} />
        </Link>
      )}
    </aside>
  );
}
