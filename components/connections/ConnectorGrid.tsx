"use client";

import ConnectorCard from "./ConnectorCard";
import type { ConnectorRegistryItem } from "@/lib/api/connections";

type Props = {
  connectors: ConnectorRegistryItem[];
  onSelect: (connector: ConnectorRegistryItem) => void;
};

export default function ConnectorGrid({ connectors, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {connectors.map((connector) => (
        <ConnectorCard
          key={connector.key}
          connector={connector}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}