import React from 'react'
import { Link } from 'react-router-dom'

export default function Footersys() {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <span className="mb-2 sm:mb-0">© 2024 SageFI. Todos os direitos reservados.</span>
        <div className="space-x-4">
          <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">Política de Privacidade</Link>
          <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">Termos de Serviço</Link>
          <Link to="/about-us" className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out">Quem Somos</Link>
        </div>
      </div>
    </footer>
  )
}