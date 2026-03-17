import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function Prezzi() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Prezzi
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Tariffe trasparenti e flessibili per le tue esigenze
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Piano Base */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Lezione Singola</h3>
            <p className="mt-4 text-5xl font-extrabold text-gray-900">€25</p>
            <p className="mt-2 text-gray-500">per ora</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Lezione individuale
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Materiale didattico incluso
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Supporto via email
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/contatti" className="block w-full text-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50">
                Prenota
              </Link>
            </div>
          </div>

          {/* Piano Pacchetto */}
          <div className="bg-blue-600 p-8 rounded-lg shadow-lg transform scale-105">
            <h3 className="text-2xl font-bold text-white">Pacchetto 5 Lezioni</h3>
            <p className="mt-4 text-5xl font-extrabold text-white">€110</p>
            <p className="mt-2 text-blue-100">€22 per ora</p>
            <ul className="mt-6 space-y-4 text-white">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                5 lezioni individuali
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Materiale didattico incluso
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Supporto via email prioritario
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Risparmio del 12%
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/contatti" className="block w-full text-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
                Scegli questo piano
              </Link>
            </div>
          </div>

          {/* Piano Mensile */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Pacchetto 10 Lezioni</h3>
            <p className="mt-4 text-5xl font-extrabold text-gray-900">€200</p>
            <p className="mt-2 text-gray-500">€20 per ora</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                10 lezioni individuali
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Materiale didattico incluso
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Supporto via email e WhatsApp
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Risparmio del 20%
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/contatti" className="block w-full text-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50">
                Prenota
              </Link>
            </div>
          </div>
        </div>

        {/* Note aggiuntive */}
        <div className="mt-12 text-center text-gray-600">
          <p>Tutti i prezzi sono da intendersi per lezioni della durata di 60 minuti.</p>
          <p className="mt-2">Le lezioni possono essere svolte online o in presenza nella zona di [tua città].</p>
        </div>
      </main>
    </div>
  )
}
