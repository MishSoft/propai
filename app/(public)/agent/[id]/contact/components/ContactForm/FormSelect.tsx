import { useId } from "react";
import * as Select from "@radix-ui/react-select";

interface Props {
  label: string;
  name: string;
  options: { label: string; value: string; disabled?: boolean }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FormSelect = ({ label, name, options, value, onChange, disabled = false }: Props) => {
  const labelId = useId();

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label id={labelId} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <Select.Root
        name={name}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <Select.Trigger
          aria-labelledby={labelId}
          className="group/trigger inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <Select.Value />
          <Select.Icon
            aria-hidden="true"
            className="shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            className="z-[1100] flex max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-gray-700 shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-150 ease-out"
          >
            <Select.ScrollUpButton
              aria-hidden="true"
              className="flex h-7 shrink-0 items-center justify-center text-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
              </svg>
            </Select.ScrollUpButton>
            <Select.Viewport className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1 touch-pan-y">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex min-h-10 w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none transition-colors data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-semibold data-[state=checked]:text-blue-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 inline-flex items-center text-blue-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4 4L19 6" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton
              aria-hidden="true"
              className="flex h-7 shrink-0 items-center justify-center text-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
              </svg>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
