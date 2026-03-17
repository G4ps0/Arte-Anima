import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Impara con</span>
              <span className="block text-blue-600">LoreTutor</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Lezioni private di Matematica, Informatica e Fisica. Approccio personalizzato per ogni studente.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/contatti" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Prenota una lezione
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Materie Section */}
        <div className="py-12 bg-white rounded-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Le Materie
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Scegli la materia in cui hai bisogno di supporto
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {/* Matematica */}
                <div className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Matematica</h3>
                    <p className="mt-4 text-gray-500">
                      Algebra, geometria, analisi e molto altro. Dai concetti base alle applicazioni avanzate.
                    </p>
                  </div>
                </div>

                {/* Informatica */}
                <div className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Informatica</h3>
                    <p className="mt-4 text-gray-500">
                      Programmazione, algoritmi, strutture dati e sviluppo software.
                    </p>
                  </div>
                </div>

                {/* Fisica */}
                <div className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Fisica</h3>
                    <p className="mt-4 text-gray-500">
                      Meccanica, termodinamica, elettromagnetismo e fisica moderna.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
