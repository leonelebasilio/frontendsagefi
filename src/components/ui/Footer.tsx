import React from 'react'

type FooterProps = {
  t: {
    allRightsReserved: string;
  };
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-background border-t py-4 px-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SageFI. {t.allRightsReserved}
      </div>
    </footer>
  )
}