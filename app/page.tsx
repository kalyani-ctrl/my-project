import GuestComplianceForm from '@/components/GuestComplianceForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Podcast Guest Compliance Checker
          </h1>
          <p className="text-slate-400">
            Automated background check & ICP fit analysis for saas.group podcast guests
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <GuestComplianceForm />
      </main>
    </div>
  );
}
