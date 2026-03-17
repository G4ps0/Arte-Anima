import Navbar from '@/components/layout/Navbar';

const tutors = [
  {
    id: 1,
    name: 'Lorenzo',
    subjects: ['Matematica', 'Informatica', 'Fisica'],
    bio: 'Fondatore di LoreTutor. Studente di Informatica con la passione per l\'insegnamento. Aiuto gli studenti a comprendere a fondo le materie scientifiche.',
    image: 'https://ui-avatars.com/api/?name=Lorenzo&background=2563eb&color=fff&size=256'
  },
  {
    id: 2,
    name: 'Marco',
    subjects: ['Matematica', 'Fisica'],
    bio: 'Forte background analitico, supporta gli studenti dalla scuola superiore fino ai primi esami universitari con grande pazienza.',
    image: 'https://ui-avatars.com/api/?name=Marco&background=2563eb&color=fff&size=256'
  },
  {
    id: 3,
    name: 'Giulia',
    subjects: ['Informatica'],
    bio: 'Sviluppatrice software. Trasforma la programmazione in un gioco da ragazzi guidando gli studenti negli algoritmi e nelle strutture dati.',
    image: 'https://ui-avatars.com/api/?name=Giulia&background=2563eb&color=fff&size=256'
  }
];

export default function TutorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            I Nostri Tutor
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Conosci i professionisti che ti aiuteranno a raggiungere i tuoi obiettivi
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tutor.image}
                    alt={`Foto di ${tutor.name}`}
                    className="rounded-full object-cover border-4 border-blue-50 shadow-sm"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tutor.name}</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {tutor.subjects.map((subject, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {tutor.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
