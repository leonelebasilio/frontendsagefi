'use client'

import React from 'react'
import Headersys from '@/components/uisys/Headersys'
import Footersys from '@/components/uisys/Footersys'
import Bodysys from '@/components/uisys/Bodysys'
import BodysysTransactionsPage from '../components/Pages/BodysysTransactionsPage'
import BodyImportData from '../components/Pages/BodyImportData'
import BodyDashboard from '../components/Pages/BodyDashboard'
import BuscarPage from '../components/Pages/BodyBuscarAI'
import BodyCapturaFoto from '@/components/Pages/BodyCapturaFoto'
import TesteSupabase from '@/components/Pages/TesteSupabase'
import BodyTags from '@/components/Pages/BodyTags'


// Define props interface for TemplatePage component
interface TemplatePageProps {
  children: React.ReactNode;
}

export default function TemplatePage({ children }: TemplatePageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header with integrated menu - now sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Headersys />
      </div>
    
      {/* Main content */}
      <Bodysys>
        {children}
        <BodysysTransactionsPage />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyImportData />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyDashboard />
      </Bodysys>

      <Bodysys>
        {children}
        <BuscarPage />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyCapturaFoto />
      </Bodysys>

      <Bodysys>
        {children}
        <TesteSupabase />
      </Bodysys>

      <Bodysys>
        {children}
        <BodyTags />
      </Bodysys>


      {/* Footer */}
      <Footersys />
    </div>
  )
}