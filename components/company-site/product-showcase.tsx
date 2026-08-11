import Link from "next/link";
import { ArrowRight, BarChart3, Heart, Newspaper } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { companyProducts, type CompanyProduct } from "@/lib/company-products";

const icons = {
  insightmend: BarChart3,
  lifemeld: Heart,
  techmeld: Newspaper,
};

function ProductLink({ product }: { product: CompanyProduct }) {
  const content = (
    <>
      Explore {product.name} <ArrowRight size={16} />
    </>
  );

  return product.external ? (
    <a href={product.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={product.href}>{content}</Link>
  );
}

export function ProductShowcase({ directory = false }: { directory?: boolean }) {
  return (
    <RevealGroup className={directory ? "product-directory" : "product-grid"}>
      {companyProducts.map((product) => {
        const Icon = icons[product.slug];

        return (
          <RevealItem key={product.slug}>
            <article
              id={directory ? product.slug : undefined}
              data-section-nav-item={directory ? "true" : undefined}
              data-section-label={directory ? product.name : undefined}
              className={
                directory
                  ? `directory-card product-${product.slug}`
                  : `product-card ecosystem-card product-${product.slug}`
              }
            >
              <div className={directory ? undefined : "product-icon"}>
                <Icon />
              </div>
              <div>
                <p className="product-type">{product.category}</p>
                {directory ? <h2>{product.name}</h2> : <h3>{product.name}</h3>}
                <p className="product-headline">{product.headline}</p>
                <p>{product.description}</p>
                <ul className="product-capabilities" aria-label={`${product.name} capabilities`}>
                  {product.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
                {product.assistant && <p className="product-assistant">{product.assistant}</p>}
                <ProductLink product={product} />
              </div>
            </article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
