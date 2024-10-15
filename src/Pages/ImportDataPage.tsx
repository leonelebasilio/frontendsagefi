'use client'

import React from 'react'
import Headersys from '@/components/uisys/Headersys'
import Footersys from '@/components/uisys/Footersys'
import Bodysys from '@/components/uisys/Bodysys'
import BodysysTransactionsPage from '../components/Pages/BodysysTransactionsPage'
import BodyImportData from '../components/Pages/BodyImportData'
import BodyCapturaFoto from '@/components/Pages/BodyCapturaFoto'
import BodyImportacao from  '../components/Pages/BodyImportacao'
import AiGeminiImportacao from '../components/uisys/AiGeminiImportacao'


// Define props interface for TemplatePage component
interface TemplatePageProps {
  children: React.ReactNode;
}

export default function ImportDataPage({ children }: ImportDataPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header with integrated menu - now sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Headersys />
      </div>
    
      {/* Main content */}

      <Bodysys>
        {children}
        <BodyImportacao />
      </Bodysys>

      <Bodysys>
        {children}
        <AiGeminiImportacao />
      </Bodysys>
   
      <Bodysys>
        {children}
        <BodyImportData />
      </Bodysys>







      <Bodysys>
        {children}
        <BodyCapturaFoto />
      </Bodysys>
      


      {/* Footer */}
      <Footersys />
    </div>
  )
}