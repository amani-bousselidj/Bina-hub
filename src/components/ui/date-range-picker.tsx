// @ts-nocheck
import { useState } from "react"
import { Button, DatePicker, Popover, Text } from "@medusajs/ui"
import { CalendarDays } from "@medusajs/icons"
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface DateRangePickerProps {
  value: { from: Date; to: Date }
  onChange: (range: { from: Date; to: Date }) => void
}

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)

  const formatDateRange = (range: { from: Date; to: Date }) => {
    const fromStr = range.from.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: range.from.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    })
    const toStr = range.to.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: range.to.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    })
    return `${fromStr} - ${toStr}`
  }

  const presetRanges = [
    {
      label: "Last 7 days",
      value: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: "Last 30 days", 
      value: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: "Last 90 days",
      value: {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: "This month",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    {
      label: "Last month",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="secondary" className="gap-x-2" onClick={() => alert('Button clicked')}>
          <CalendarDays />
          <Text size="small">{formatDateRange(value)}</Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0" align="end">
        <div className="flex">
          <div className="border-r p-4">
            <Text size="small" weight="plus" className="mb-3">
              Quick Select
            </Text>
            <div className="flex flex-col gap-1">
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  variant="transparent"
                  size="small"
                  className="justify-start"
                  onClick={() => {
                    onChange(preset.value)
                    setOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-4">
              <div>
                <Text size="small" weight="plus" className="mb-2">
                  From
                </Text>
                <DatePicker
                  value={value.from}
                  onChange={(date) => {
                    if (date) {
                      onChange({ ...value, from: date })
                    }
                  }}
                />
              </div>
              <div>
                <Text size="small" weight="plus" className="mb-2">
                  To
                </Text>
                <DatePicker
                  value={value.to}
                  onChange={(date) => {
                    if (date) {
                      onChange({ ...value, to: date })
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="small" onClick={() => setOpen(false)}>
                Apply
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  )
}




