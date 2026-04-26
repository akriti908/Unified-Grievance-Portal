import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
  PieChart, Pie, Cell
} from 'recharts'

const API = 'http://ugp-backend.onrender.com'

const COLORS = ['#1E40AF','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16']

export default function Analytics() {
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

  if (loading) return <div className="p-12 text-center text-gray-400">Loading analytics...</div>

  if (grievances.length === 0) return (
    <div className="p-12 text-center text-gray-400">
      <p className="text-4xl mb-3">📊</p>
      <p>No grievances submitted yet. Analytics will appear here once data is available.</p>
    </div>
  )

  // ── Most reported issue ──────────────────────────────
  const categoryCounts: Record<string, number> = {}
  grievances.forEach(g => {
    categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1
  })
  const categoryData = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.name && item.name.trim() !== "")  
    .sort((a, b) => b.value - a.value)

  const topCategory = categoryData[0]

  // ── Category trend over time ─────────────────────────
  // Group by submission index buckets (simulate time since we store no timestamp)
  // Split grievances into 5 equal time buckets
  const bucketSize = Math.max(1, Math.ceil(grievances.length / 5))
  const trendData: any[] = []
  const allCategories = Object.keys(categoryCounts)

  for (let i = 0; i < 5; i++) {
    const bucket = grievances.slice(i * bucketSize, (i + 1) * bucketSize)
    const entry: any = { period: `Batch ${i + 1}` }
    allCategories.forEach(cat => {
      entry[cat] = bucket.filter(g => g.category === cat).length
    })
    trendData.push(entry)
  }

  // Top 4 categories for trend lines
  const topCategories = categoryData.slice(0, 4).map(c => c.name)
  const lineColors = ['#1E40AF', '#EF4444', '#10B981', '#F59E0B']

  // ── Category wise area mapping ───────────────────────
  // For each area (district), find dominant category
  const areaMap: Record<string, Record<string, number>> = {}
  grievances.forEach(g => {
    const area = g.area || g.city || 'Unknown'
    if (!areaMap[area]) areaMap[area] = {}
    areaMap[area][g.category] = (areaMap[area][g.category] || 0) + 1
  })

  const areaData = Object.entries(areaMap).map(([area, cats]) => {
    const dominant = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]
    const total = Object.values(cats).reduce((s, v) => s + v, 0)
    return {
      city: area,
      dominant_category: dominant[0],
      dominant_count: dominant[1],
      total,
      percentage: Math.round((dominant[1] / total) * 100),
      all_categories: cats
    }
  }).sort((a, b) => b.total - a.total)

  // ── Area-Category breakdown for bar chart ────────────
  const areaBarData = areaData.slice(0, 8).map(a => {
    const entry: any = { city: a.city }
    Object.entries(a.all_categories).forEach(([cat, count]) => {
      entry[cat] = count
    })
    return entry
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Insights from {grievances.length} grievances</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">Most Reported Issue</p>
          <p className="text-2xl font-bold text-blue-800">{topCategory?.name}</p>
          <p className="text-sm text-blue-600 mt-1">{topCategory?.value} grievances</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <p className="text-xs text-green-600 font-medium mb-1">Total Categories</p>
          <p className="text-2xl font-bold text-green-800">{categoryData.length}</p>
          <p className="text-sm text-green-600 mt-1">across all grievances</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium mb-1">Areas Affected</p>
          <p className="text-2xl font-bold text-purple-800">{areaData.length}</p>
          <p className="text-sm text-purple-600 mt-1">districts/locations</p>
        </div>
      </div>

      {/* Most Reported Issue — full breakdown */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="font-bold text-gray-800 mb-1">Most Reported Issues</h2>
        <p className="text-sm text-gray-500 mb-6">Total grievances by category</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical"
                margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" axisLine={false} tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: '#374151', fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked list */}
          <div className="space-y-3">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((item.value / categoryData[0].value) * 100)}%`,
                        backgroundColor: COLORS[i % COLORS.length]
                      }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Trend Over Time */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="font-bold text-gray-800 mb-1">Category Trend Over Time</h2>
        <p className="text-sm text-gray-500 mb-6">
          Submission trends for top {topCategories.length} categories across batches
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="period" axisLine={false} tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend />
              {topCategories.map((cat, i) => (
                <Line key={cat} type="monotone" dataKey={cat}
                  stroke={lineColors[i]} strokeWidth={2.5}
                  dot={{ fill: lineColors[i], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trend insight */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {topCategories.map((cat, i) => {
            const first = trendData[0]?.[cat] || 0
            const last = trendData[trendData.length - 1]?.[cat] || 0
            const trend = last > first ? '↑ Increasing' : last < first ? '↓ Decreasing' : '→ Stable'
            const trendColor = last > first ? 'text-red-600' : last < first ? 'text-green-600' : 'text-gray-500'
            return (
              <div key={cat} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lineColors[i] }} />
                <span className="text-sm text-gray-700 flex-1">{cat}</span>
                <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category wise Area Mapping */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="font-bold text-gray-800 mb-1">Category-wise Area Mapping</h2>
        <p className="text-sm text-gray-500 mb-6">Which issues are dominant in which areas</p>

        {/* Stacked bar by area */}
        {areaBarData.length > 0 && (
          <div className="h-[280px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaBarData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="area" axisLine={false} tickLine={false}
                  tick={{ fill: '#374151', fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend />
                {allCategories.map((cat, i) => (
                  <Bar key={cat} dataKey={cat} stackId="a"
                    fill={COLORS[i % COLORS.length]}
                    radius={i === allCategories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Area cards */}
        <div className="grid grid-cols-2 gap-3">
          {areaData.map((item, i) => {
            const catIndex = allCategories.indexOf(item.dominant_category)
            const color = COLORS[catIndex % COLORS.length]
            return (
              <div key={item.city} className="p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.city}</p>
                    <p className="text-xs text-gray-400">{item.total} grievances total</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-white"
                    style={{ backgroundColor: color }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <p className="text-sm text-gray-600">
                    Mainly <b>{item.dominant_category}</b> ({item.dominant_count} cases)
                  </p>
                </div>
                {/* Mini breakdown */}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {Object.entries(item.all_categories)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, count]) => (
                      <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {cat}: {count}
                      </span>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
