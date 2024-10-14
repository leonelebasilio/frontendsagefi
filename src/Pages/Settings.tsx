'use client'

import React from 'react'
import Headersys from '@/components/uisys/Headersys'
import Footersys from '@/components/uisys/Footersys'
import Bodysys from '@/components/uisys/Bodysys'
import BodyConta from '@/components/Pages/BodyConta'
import BodyCategoria from '@/components/Pages/BodyCategoria'
import BodyTags from '@/components/Pages/BodyTags'
import BodyCartao from '@/components/Pages/BodyCartao'


// Define props interface for Settings component
interface SettingsProps {
  children: React.ReactNode;
}

export default function Settings({ children }: SettingsProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header with integrated menu - now sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Headersys />
      </div>
    
      {/* Main content */}
      <Bodysys>
        {children}
        <BodyCategoria />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyConta />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyTags />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyCartao />
      </Bodysys>


      {/* Footer */}
      <Footersys />
    </div>
  )
}