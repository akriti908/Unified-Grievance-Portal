import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const API = 'http://ugp-backend.onrender.com'

const PRIORITY_COLOR: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
}

export default function PendingReviews() {
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentUser = localStorage.getItem('ugp_current_user')
  const userEmail = currentUser ? JSON.parse(currentUser).email : ''
  const userName = localStorage.getItem('ugp_user_name') || ''
  const userRole = currentUser ? JSON.parse(currentUser).role : 'citizen'
  const userContact = localStorage.getItem("contact")
  function load() {
    fetch(`${API}/api/admin/all`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        let pending

        if (userRole === 'admin') {
  pending = list.filter((g: any) => g.status === 'Resolved' && !g.rating)
} else {
  pending = list.filter((g: any) => {
    return g.contact === userContact &&
            g.status === "Resolved" &&
            !g.rating
    })
}
        setGrievances(pending)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [userRole])

  async function submitReview() {
    if (rating === 0) return
    await fetch(`${API}/api/submit-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingId: reviewing.trackingId,
        rating,
        feedback
      })
    })
    setSubmitted(true)
    setTimeout(() => {
      setReviewing(null)
      setRating(0)
      setHoverRating(0)
      setFeedback('')
      setSubmitted(false)
      load()
    }, 2000)
  }

  const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pending Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">
          {userRole === 'admin'
            ? 'All resolved grievances awaiting citizen feedback'
            : 'Your resolved grievances that need a rating'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
          <p className="text-3xl font-bold text-yellow-700">{grievances.length}</p>
          <p className="text-sm text-yellow-600 mt-1">Awaiting Review</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <p className="text-3xl font-bold text-green-700">
            {grievances.filter(g => g.priority === 'High').length}
          </p>
          <p className="text-sm text-green-600 mt-1">High Priority Resolved</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-3xl font-bold text-blue-700">
            {[...new Set(grievances.map(g => g.category))].length}
          </p>
          <p className="text-sm text-blue-600 mt-1">Categories</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Resolved — Awaiting Your Rating</h2>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {grievances.length} pending
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : grievances.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-semibold text-gray-600">All caught up!</p>
            <p className="text-sm mt-1">No pending reviews at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {grievances.map(g => (
              <div key={g.trackingId} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{g.trackingId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[g.priority] || 'bg-gray-100'}`}>
                        {g.priority}
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {g.category}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Resolved
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{g.text}</p>
                    <div className="text-xs text-gray-400 space-x-3">
                      {userRole === 'admin' && <span>👤 {g.contact}</span>}
                      <span>📍 {g.city}, {g.area}</span>
                      <span>🏢 {g.nearest_office || "Not assigned"}</span>
                    </div>
                    {g.remarks?.length > 0 && (
                      <div className="mt-2 p-2.5 bg-blue-50 rounded-lg text-xs text-blue-800">
                        <b>Admin:</b> {g.remarks[g.remarks.length - 1]}
                      </div>
                    )}
                  </div>
                  {userRole !== 'admin' && (
                    <button
                      onClick={() => { setReviewing(g); setRating(0); setFeedback('') }}
                      className="shrink-0 flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      <Star size={14} className="fill-white" />
                      Rate Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReviewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-green-700 mb-1">Thank you!</h3>
                <p className="text-gray-500 text-sm">Your feedback has been submitted.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-1">Rate Resolution</h3>
                <p className="text-xs font-mono text-gray-400 mb-4">{reviewing.trackingId}</p>
                <p className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-xl">{reviewing.text}</p>
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                  How satisfied are you with the resolution?
                </p>
                <div className="flex justify-center gap-2 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110">
                      <Star size={36}
                        className={s <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm font-medium text-yellow-600 mb-4 h-5">
                  {STAR_LABELS[hoverRating || rating]}
                </p>
                <textarea
                  placeholder="Share your experience (optional)..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  rows={3} value={feedback}
                  onChange={e => setFeedback(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={submitReview} disabled={rating === 0}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-white py-2.5 rounded-xl font-semibold">
                    Submit Rating
                  </button>
                  <button onClick={() => setReviewing(null)}
                    className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
