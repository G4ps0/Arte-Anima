import Navbar from '@/components/layout/Navbar'

export default function Contatti() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Contattami
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Prenota una lezione o chiedi informazioni
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form name="contact" method="POST" data-netlify="true" className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome e Cognome
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Materia
              </label>
              <select
                id="subject"
                name="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleziona una materia</option>
                <option value="matematica">Matematica</option>
                <option value="informatica">Informatica</option>
                <option value="fisica">Fisica</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Messaggio
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Invia richiesta
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Altri modi per contattarmi</h2>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600">
                <strong>Email:</strong> tutor@example.com
              </p>
              <p className="text-gray-600">
                <strong>Telefono:</strong> +39 XXX XXX XXXX
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
