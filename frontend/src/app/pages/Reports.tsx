import React, { useEffect, useState } from 'react'
import { Download, TrendingUp, MapPin, Star, BarChart3, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const API = 'http://localhost:5000'
const COLORS = ['#1E40AF','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16']

export default function Reports() {
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/all`)
      .then(res => res.json())
      .then(data => {
        setGrievances(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-12 text-center text-gray-400">Loading reports...</div>

  if (grievances.length === 0) return (
    <div className="p-12 text-center text-gray-400">
      <p className="text-4xl mb-3">📊</p>
      <p>No data available yet. Reports will appear once grievances are submitted.</p>
    </div>
  )

  // ── Summary stats ─────────────────────────────────────
  const total = grievances.length
  const resolved = grievances.filter(g => g.status === 'Resolved').length
  const pending = grievances.filter(g => g.status === 'Pending').length
  const processing = grievances.filter(g => g.status === 'Processing').length
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const rated = grievances.filter(g => g.rating)
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1)
    : 'N/A'

  // ── Status distribution ───────────────────────────────
  const statusData = [
    { name: 'Resolved', value: resolved, color: '#10B981' },
    { name: 'Processing', value: processing, color: '#5c9cf6' },
    { name: 'Pending', value: pending, color: '#EF4444' },
  ].filter(s => s.value > 0)

  // ── Category-wise report ──────────────────────────────
  const categoryMap: Record<string, any> = {}
  grievances.forEach(g => {
    if (!categoryMap[g.category]) {
      categoryMap[g.category] = { total: 0, resolved: 0, ratings: [] }
    }
    categoryMap[g.category].total++
    if (g.status === 'Resolved') categoryMap[g.category].resolved++

    // ✅ FIX: store rating in category, NOT officerMap
    if (g.rating) {
      categoryMap[g.category].ratings.push(g.rating)
    }
  })
  const categoryReport = Object.entries(categoryMap).map(([name, data]: any) => ({
    name,
    total: data.total,
    resolved: data.resolved,
    resolutionRate: Math.round((data.resolved / data.total) * 100),
    avgRating: data.ratings.length > 0
      ? (data.ratings.reduce((s: number, r: number) => s + r, 0) / data.ratings.length).toFixed(1)
      : 'N/A'
  })).sort((a, b) => b.total - a.total)

  // ── Location-wise report ──────────────────────────────
  const locationMap: Record<string, any> = {}
  grievances.forEach(g => {
    const loc =g.city || 'Unknown'
    if (!locationMap[loc]) locationMap[loc] = { total: 0, resolved: 0 }
    locationMap[loc].total++
    if (g.status === 'Resolved') locationMap[loc].resolved++
  })
  const locationReport = Object.entries(locationMap)
    .map(([city, data]: any) => ({
      city,
      total: data.total,
      resolved: data.resolved,
      resolutionRate: Math.round((data.resolved / data.total) * 100)
    }))
    .sort((a, b) => b.total - a.total)

  // ── Officer performance ───────────────────────────────
  const officerMap: Record<string, any> = {}
  grievances.forEach(g => {
    if (g.officer_name) {
      if (!officerMap[g.officer_name]) {
        officerMap[g.officer_name] = {
          phone: g.officer_phone || 'N/A',
          assigned: 0, resolved: 0, ratings: []
        }
      }
      officerMap[g.officer_name].assigned++
      if (g.status === 'Resolved') officerMap[g.officer_name].resolved++
      if (g.rating) officerMap[g.officer_name].ratings.push(g.rating)
    }
  })
  const officerReport = Object.entries(officerMap).map(([name, data]: any) => ({
    name,
    phone: data.phone,
    assigned: data.assigned,
    resolved: data.resolved,
    resolutionRate: Math.round((data.resolved / data.assigned) * 100),
    avgRating: data.ratings.length > 0
      ? (data.ratings.reduce((s: number, r: number) => s + r, 0) / data.ratings.length).toFixed(1)
      : 'N/A'
  })).sort((a, b) => b.assigned - a.assigned)

  // ── CSV Export ────────────────────────────────────────
  function exportCSV() {
    const headers = ['Tracking ID','Name','Description','Category','Priority',
      'Status','State','District','Department','Officer','Rating','Feedback']
    const rows = grievances.map(g => [
  g.trackingId,
  "", // name not present
  `"${g.text}"`,
  g.category,
  g.priority,
  g.status,
  "", // state not present
  g.city,
  g.department || "",
  g.officer_name || '',
  g.rating || '',
  `"${g.feedback || ''}"`
])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grievance_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Complete overview of all grievances</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 bg-blue-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Grievances', value: total, icon: AlertCircle, color: 'bg-blue-50 text-blue-800', iconColor: 'text-blue-600' },
          { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'bg-green-50 text-green-800', iconColor: 'text-green-600' },
          { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-50 text-yellow-800', iconColor: 'text-yellow-600' },
          { label: 'Processing', value: processing, icon: BarChart3, color: 'bg-blue-50 text-blue-800', iconColor: 'text-blue-600' }
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 border`}>
            <div className="flex items-center justify-between mb-2">
              <s.icon size={20} className={s.iconColor} />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Resolution Rate + Status Pie */}
      <div className="grid grid-cols-3 gap-6">
        {/* Resolution Rate */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-4">Resolution Rate</p>
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3"
                strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-green-700">{resolutionRate}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{resolved} of {total} resolved</p>
        </div>

        {/* Avg Rating */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-4">Avg Citizen Rating</p>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={28}
                className={s <= Math.round(parseFloat(avgRating as string) || 0)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <p className="text-3xl font-bold text-yellow-600">{avgRating}</p>
          <p className="text-xs text-gray-400 mt-2">{rated.length} reviews submitted</p>
        </div>

        {/* Status Pie */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Status Distribution</p>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%"
                  innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-1">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category-wise Report */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-gray-800">Category-wise Report</h2>
          <p className="text-sm text-gray-500 mt-1">Resolution rate and citizen satisfaction per category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Resolved</th>
                <th className="px-6 py-4">Resolution Rate</th>
                <th className="px-6 py-4">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categoryReport.map((item, i) => (
                <tr key={item.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{item.total}</td>
                  <td className="px-6 py-4 text-sm text-green-700 font-medium">{item.resolved}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                        <div className="h-full bg-green-500 rounded-full"
                          style={{ width: `${item.resolutionRate}%` }} />
                      </div>
                      <span className="text-sm font-medium">{item.resolutionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{item.avgRating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location-wise Report */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-gray-800">Location-wise Report</h2>
          <p className="text-sm text-gray-500 mt-1">Grievance distribution and resolution by area</p>
        </div>
        <div className="p-6">
          <div className="h-[250px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationReport.slice(0, 8)}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="city" axisLine={false} tickLine={false}
                  tick={{ fill: '#374151', fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="total" name="Total" fill="#1E40AF" radius={[4,4,0,0]} barSize={30} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4,4,0,0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {locationReport.map((item, i) => (
              <div key={item.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{item.city}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-500">{item.total} total</span>
                  <span className="text-green-600 font-semibold">{item.resolutionRate}% resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Officer Performance */}
      {officerReport.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0]">
            <h2 className="font-bold text-gray-800">Officer Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Field officer assignment and resolution stats</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Officer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Assigned</th>
                  <th className="px-6 py-4">Resolved</th>
                  <th className="px-6 py-4">Resolution Rate</th>
                  <th className="px-6 py-4">Avg Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {officerReport.map(officer => (
                  <tr key={officer.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                          {officer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{officer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{officer.phone}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{officer.assigned}</td>
                    <td className="px-6 py-4 text-sm text-green-700 font-medium">{officer.resolved}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-green-500 rounded-full"
                            style={{ width: `${officer.resolutionRate}%` }} />
                        </div>
                        <span className="text-sm font-medium">{officer.resolutionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{officer.avgRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}