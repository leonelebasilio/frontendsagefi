'use client'

import React from 'react'
import Headersys from '@/components/uisys/Headersys'
import Footersys from '@/components/uisys/Footersys'
import Bodysys from '@/components/uisys/Bodysys'
import BodysysTransactionsPage from '../components/Pages/BodysysTransactionsPage'
import BodyImportData from '../components/Pages/BodyImportData'
import BodyDashboard from '../components/Pages/BodyDashboard'
import BodyPersonalPage from '@/components/Pages/BodyPersonalPage'

// Define props interface for CompanyDataPage component
interface CompanyDataPageProps {
  children: React.ReactNode;
}

export default function CompanyDataPage({ children }: CompanyDataPage) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header with integrated menu - now sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Headersys />
      </div>
    
      {/* Main content */}
    

      <Bodysys>
        {children}
        <BodyPersonalPage />
      </Bodysys>


      {/* Footer */}
      <Footersys />
    </div>
  )
}