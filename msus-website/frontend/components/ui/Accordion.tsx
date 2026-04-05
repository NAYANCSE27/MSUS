'use client';

import React, { useState, createContext, useContext } from 'react';
import { clsx } from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionContextType {
  openItem: string | null;
  setOpenItem: (item: string | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider');
  }
  return context;
}

interface AccordionProps {
  children: React.ReactNode;
  defaultOpen?: string;
  className?: string;
}

export function Accordion({ children, defaultOpen = null, className }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={clsx('divide-y divide-gray-200', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionItem({ children, value, className }: AccordionItemProps) {
  return (
    <div className={className} data-value={value}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionTrigger({ children, value, className }: AccordionTriggerProps) {
  const { openItem, setOpenItem } = useAccordion();
  const isOpen = openItem === value;

  return (
    <button
      type="button"
      onClick={() => setOpenItem(isOpen ? null : value)}
      className={clsx(
        'flex w-full items-center justify-between py-4 text-left',
        className
      )}
    >
      <span className="text-base font-medium text-gray-900">{children}</span>
      <ChevronDownIcon
        className={clsx(
          'h-5 w-5 text-gray-500 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function AccordionContent({ children, value, className }: AccordionContentProps) {
  const { openItem } = useAccordion();
  const isOpen = openItem === value;

  if (!isOpen) return null;

  return (
    <div className={clsx('pb-4', className)}>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}
