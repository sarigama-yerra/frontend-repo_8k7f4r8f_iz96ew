import JobSearch from './components/JobSearch'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative min-h-screen p-8">
        <header className="max-w-5xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-white">Job Opportunity Finder</h1>
          <p className="text-blue-200/80 mt-2">Search and get alerts for new jobs from popular sources. The system scans every 10 minutes.</p>
        </header>
        <main>
          <JobSearch />
        </main>
      </div>
    </div>
  )
}

export default App
