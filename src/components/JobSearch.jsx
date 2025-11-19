import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function JobSearch() {
  const [keyword, setKeyword] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [userKeywords, setUserKeywords] = useState('')
  const [message, setMessage] = useState('')

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (keyword) params.set('keyword', keyword)
      const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`)
      const data = await res.json()
      setJobs(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keywords: userKeywords.split(',').map(k => k.trim()).filter(Boolean) })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessage(err?.detail || 'Unable to save user')
      } else {
        setMessage('You will receive notifications when new jobs are found.')
      }
    } catch (e) {
      setMessage('Network error')
    }
  }

  const trigger = async () => {
    setLoading(true)
    try {
      await fetch(`${API_BASE}/api/trigger`, { method: 'POST' })
      await fetchJobs()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-6">Search Jobs</h2>
      <div className="flex gap-3 mb-6">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Filter by keyword (optional)"
          className="flex-1 rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={fetchJobs} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Search</button>
        <button onClick={trigger} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Run Scraper</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((j, idx) => (
          <a key={idx} href={j.url} target="_blank" rel="noreferrer" className="block bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 transition">
            <div className="text-xs text-blue-300/80 uppercase tracking-wide mb-2">{j.source}</div>
            <div className="text-white font-semibold mb-2">{j.title}</div>
            {j.company && <div className="text-sm text-slate-300">{j.company}</div>}
            {j.location && <div className="text-sm text-slate-400">{j.location}</div>}
          </a>
        ))}
      </div>

      <div className="mt-10 border-t border-slate-700 pt-8">
        <h3 className="text-2xl font-semibold text-white mb-3">Get email alerts</h3>
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={userKeywords} onChange={e => setUserKeywords(e.target.value)} placeholder="Keywords (comma separated)" className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Save</button>
        </form>
        {message && <div className="text-sm text-emerald-300 mt-2">{message}</div>}
      </div>
    </div>
  )
}
