import React, { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, XCircle, Phone, User, Building2, MapPin, Tag, Calendar } from 'lucide-react'

const API = 'http://localhost:5000';

const STATUS_STEPS = ['Pending', 'Processing', 'Resolved']

const STATUS_COLOR: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

const PRIORITY_COLOR: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
}

export default function TrackStatus() {
  const [trackId, setTrackId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function track() {
  console.log("TRACK CLICKED");

  if (!trackId.trim()) {
    console.log("EMPTY ID");
    return;
  }

  setLoading(true);
  setError("");
  setResult(null);

  try {
    const res = await fetch(`${API}/api/track/${trackId.trim().toUpperCase()}`);
    const data = await res.json();

    console.log("API DATA:", data);

    if (!data || data.error) {
      setError("Tracking ID not found");
    } else {
      setResult(data);
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    setError("Server error");
  }

  setLoading(false);
}

  const currentStep = result
    ? result.status === 'Rejected' ? -1
    : STATUS_STEPS.indexOf(result.status)
    : -1

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Track Grievance Status</h1>
        <p className="text-gray-500 text-sm mt-1">Enter your tracking ID to get full details</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <div className="flex gap-2">
          <input
            placeholder="Enter Tracking ID e.g. GR1714567891234"
            className="flex-1 border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
            value={trackId}
            onChange={e => setTrackId(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && track()}
          />
          <button onClick={track} disabled={loading}
            className="bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-900 disabled:opacity-50">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {result && (
        <>
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-800">Grievance Status</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[result.status] || 'bg-gray-100'}`}>
                {result.status}
              </span>
            </div>

            {result.status === 'Rejected' ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-700">
                <XCircle size={24} />
                <div>
                  <p className="font-semibold">Grievance Rejected</p>
                  <p className="text-sm opacity-80">Your grievance could not be processed. Please contact the helpline.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative
                        ${i <= currentStep ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {i < currentStep ? <CheckCircle2 size={20} /> :
                         i === currentStep ? <Clock size={20} /> :
                         <div className="w-3 h-3 rounded-full bg-gray-300" />}
                      </div>
                      <p className={`text-xs mt-2 font-medium text-center ${i <= currentStep ? 'text-blue-800' : 'text-gray-400'}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Progress line */}
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0">
                  <div className="h-full bg-blue-800 transition-all duration-500"
                    style={{ width: `${currentStep <= 0 ? 0 : currentStep >= 2 ? 100 : 50}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Grievance Details */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h2 className="font-bold text-gray-800 mb-4">Grievance Details</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1 font-mono">{result.trackingId}</p>
                <p className="text-sm text-gray-800">{result.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <Tag size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Category</p>
                    <p className="text-sm font-medium">{result.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Priority</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[result.priority] || ''}`}>
                      {result.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-medium">{result.city}, {result.area}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <Calendar size={16} className="text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Expected Resolution</p>
                    <p className="text-sm font-medium">{result.action_within}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl col-span-2">
                  
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Officer */}
          {result.officer_name ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
              <h2 className="font-bold text-gray-800 mb-4">Assigned Field Officer</h2>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {result.officer_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{result.officer_name}</p>
                  <p className="text-sm text-gray-500 mb-3">Field Officer · {result.department || "not available"}</p>
                  <a href={`tel:${result.officer_phone}`}
                    className="inline-flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-900">
                    <Phone size={15} />
                    {result.officer_phone}
                  </a>
                  {result.officer_note && (
                    <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-600">
                      <b>Note:</b> {result.officer_note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
              <h2 className="font-bold text-gray-800 mb-2">Field Officer</h2>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-gray-500">
                <User size={20} />
                <p className="text-sm">No officer assigned yet. You will be notified once an officer is assigned.</p>
              </div>
            </div>
          )}

          {/* ⭐ Citizen Rating */}
{result.rating && (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
    <h2 className="font-bold text-gray-800 mb-3">Your Feedback</h2>

    <div className="flex items-center gap-1 mb-2">
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={`text-xl ${
            s <= result.rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>

    <p className="text-sm text-gray-600">
      {result.feedback || "No feedback given"}
    </p>
  </div>
)}

          {/* Admin Remarks */}
          {result.remarks?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
              <h2 className="font-bold text-gray-800 mb-4">Updates from Admin</h2>
              <div className="space-y-3">
                {result.remarks.map((r: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-800 mt-1.5 shrink-0" />
                    <p className="text-sm text-gray-700">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Helpline */}
          <div className="bg-gradient-to-r from-[#1E40AF] to-[#1e3a8a] rounded-2xl p-6 text-white">
            <h2 className="font-bold mb-1">Need Help?</h2>
            <p className="text-blue-100 text-sm mb-3">Contact the state helpline for urgent assistance</p>
            <a href={`tel:${result.helpline || "1800-000-000"}`}
              className="inline-flex items-center gap-2 bg-white text-blue-800 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50">
              <Phone size={16} />
              {result.helpline}
            </a>
          </div>
        </>
      )}
    </div>
  )
}