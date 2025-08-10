// @ts-nocheck
import { Component, PencilSquare, Trash } from "@medusajs/icons"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useRouter } from "next/navigation"

import { ActionMenu } from "@/components/common/action-menu"
import { SectionRow } from "@/components/common/section"

type VariantGeneralSectionProps = {
  variant: any
}

export function VariantGeneralSection({ variant }: VariantGeneralSectionProps) {
  const router = useRouter()

  const hasInventoryKit = variant.inventory?.length > 1

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${variant.title}?`)

    if (!confirmed) {
      return
    }

    // Mock deletion
    console.log('Deleting variant:', variant.id)
    router.back()
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Heading>{variant.title}</Heading>
            {hasInventoryKit && (
              <span className="text-ui-fg-muted font-normal">
                <Component />
              </span>
            )}
          </div>
          <span className="text-ui-fg-subtle txt-small mt-2">
            Product Variant
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: "Edit",
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: "Delete",
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <SectionRow title="SKU" value={variant.sku} />
      {variant.options?.map((o) => (
        <SectionRow
          key={o.id}
          title={o.option?.title!}
          value={<Badge size="2xsmall">{o.value}</Badge>}
        />
      ))}
    </Container>
  )
}






