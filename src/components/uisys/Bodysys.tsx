import React from 'react'

// Define props interface for Bodysys component
interface BodysysProps {
  children: React.ReactNode;
}

export default function Bodysys({ children }: BodysysProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {children}
    </main>
  )
}