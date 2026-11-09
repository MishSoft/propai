import React from 'react';
import * as Select from '@radix-ui/react-select';

interface Props {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string) => void;
  icon?: React.ReactNode; // დავამატეთ იკონკის პროპი
}

export const ListingSelect: React.FC<Props> = ({ label, name, options, value, onChange, icon }: Props) => {
  const labelId = `${name}-label`;

  return (
    <div className="relative group w-full flex flex-col gap-2">
      <label
        id={labelId}
        htmlFor={name}
        className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
      >
        {label}
      </label>

      <Select.Root name={name} value={String(value)} onValueChange={onChange}>
        <Select.Trigger
          id={name}
          aria-labelledby={labelId}
          className="group/trigger relative inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 py-4 pl-4 pr-4 text-left text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/60 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 data-[state=open]:border-purple-400 data-[state=open]:bg-white"
        >
          <span className="flex min-w-0 items-center gap-3">
            {icon && <span aria-hidden="true" className="shrink-0 text-slate-400">{icon}</span>}
            <Select.Value />
          </span>
          <Select.Icon aria-hidden="true" className="shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            data-listing-select-content=""
            position="popper"
            align="start"
            sideOffset={6}
            collisionPadding={8}
            className="z-[1300] max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 text-slate-700 shadow-2xl shadow-slate-900/15 backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-150 ease-out"
          >
            <Select.ScrollUpButton className="flex h-7 items-center justify-center text-purple-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
              </svg>
            </Select.ScrollUpButton>
            <Select.Viewport className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1 touch-pan-y">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={String(option.value)}
                  className="relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm font-semibold outline-none transition-colors data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-800 data-[state=checked]:text-purple-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 inline-flex items-center text-purple-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4 4L19 6" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-7 items-center justify-center text-purple-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
              </svg>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
