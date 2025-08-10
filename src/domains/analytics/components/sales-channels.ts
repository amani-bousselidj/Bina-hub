// @ts-nocheck
// Sales channels table helpers
import { useSearchParams } from "react-router-dom";

export const useSalesChannelTableQuery = ({ pageSize, prefix }: { pageSize: number, prefix: string }) => {
  const [searchParams] = useSearchParams();
  
  return {
    limit: pageSize,
    offset: parseInt(searchParams.get(`${prefix}_offset`) || "0"),
    q: searchParams.get(`${prefix}_q`) || undefined,
    order: searchParams.get(`${prefix}_order`) || undefined,
  };
};

export const useSalesChannelTableFilters = () => {
  return [
    {
      key: "is_disabled",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "false", label: "Active" },
        { value: "true", label: "Disabled" }
      ]
    }
  ];
};

export const useSalesChannelTableEmptyState = () => {
  return {
    title: "No sales channels",
    description: "No sales channels have been created yet.",
    action: {
      label: "Create sales channel",
      onClick: () => {}
    }
  };
};

export const useSalesChannelTableColumns = () => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }: any) => getValue()
    },
    {
      accessorKey: "description",
      header: "Description", 
      cell: ({ getValue }: any) => getValue() || "—"
    },
    {
      accessorKey: "is_disabled",
      header: "Status",
      cell: ({ getValue }: any) => getValue() ? "Disabled" : "Active"
    }
  ];
};





