// import React, { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell
// } from "recharts";
// import {
//   AlertCircle, Clock, CheckCircle2, TrendingUp, Users, FileText
// } from "lucide-react";
// import { motion } from "motion/react";
// import { Link } from "react-router-dom";
// type StatType = {
//   label: string;
//   value: number | string;
//   icon: any;
//   color: string;
// };

// const API = "http://localhost:5000";

// export const Dashboard = () => {
//   const [grievances, setGrievances] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const userContact = localStorage.getItem("contact");

//   useEffect(() => {
//     fetch(`${API}/api/admin/all`)
//       .then(res => res.json())
//       .then(data => {
//         setGrievances(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // Filter user grievances
//   const myGrievances = userContact
//     ? grievances.filter(g => g.contact === userContact)
//     : [];

//   const isAdmin = true; // 👉 change later when auth added

//   const displayed = isAdmin ? grievances : myGrievances;
//   // ✅ Stats calculation (ADD THIS)
// const total = displayed.length;
// const pending = displayed.filter(g => g.status === "Pending").length;
// const resolved = displayed.filter(g => g.status === "Resolved").length;

//   // Stats
//   const adminStats: StatType[] = [
//     { label: "Total Grievances", value: total || 0, icon: AlertCircle, color: "#1E40AF" },
//     { label: "Pending", value: pending || 0, icon: Clock, color: "#F59E0B" },
//     { label: "Resolved", value: resolved || 0, icon: CheckCircle2, color: "#10B981" },
//     { label: "Users", value: new Set(displayed.map(g => g.contact)).size, icon: Users, color: "#8B5CF6" },
//   ];

//   const citizenStats: StatType[] = [
//     { label: "My Grievances", value: total || 0, icon: FileText, color: "#1E40AF" },
//     { label: "Pending", value: pending || 0, icon: Clock, color: "#F59E0B" },
//     { label: "Resolved", value: resolved || 0, icon: CheckCircle2, color: "#10B981" },
//     { label: "Activity", value: total || 0, icon: TrendingUp, color: "#EF4444" },
//   ];

//   const stats = isAdmin ? adminStats : citizenStats;

//   // Category chart
//   const categoryMap: Record<string, number> = {};
//   displayed.forEach(g => {
//     const category = g.category || "Other";
//     categoryMap[category] = (categoryMap[category] || 0) + 1;
//   });

//   const chartData = Object.entries(categoryMap).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   // Priority chart
//   const priorityData = [
//     { name: "High", value: displayed.filter(g => g.priority === "High").length, color: "#EF4444" },
//     { name: "Medium", value: displayed.filter(g => g.priority === "Medium").length, color: "#F59E0B" },
//     { name: "Low", value: displayed.filter(g => g.priority === "Low").length, color: "#10B981" },
//   ].filter(p => p.value > 0);

//   return (
//     <div className="space-y-8">

//       <h1 className="text-2xl font-bold">Dashboard</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, i) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//           >
//             <div className="flex justify-between items-center mb-4">
              
//               {/* Icon */}
//               <div
//                 className="p-3 rounded-xl"
//                 style={{
//                   backgroundColor: `${stat.color}20`,
//                   color: stat.color,
//                 }}
//               >
//                 <stat.icon size={22} />
//               </div>

//             </div>

//             <p className="text-sm text-gray-500">{stat.label}</p>
//             <p className="text-2xl font-bold text-gray-800 mt-1">
//               {loading ? "..." : stat.value}
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Category */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="font-bold mb-4">Category Analysis</h3>

//           {chartData.length === 0 ? (
//             <p>No data</p>
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#1E40AF" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Priority */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="font-bold mb-4">Priority Distribution</h3>

//           {priorityData.length === 0 ? (
//             <p>No data</p>
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={priorityData} dataKey="value">
//                   {priorityData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h3 className="text-lg font-bold text-gray-800">
//             My Grievances
//           </h3>
//           <Link
//             to="/dashboard/my-grievances"
//             className="text-sm text-blue-600 font-medium hover:underline"
//           >
//             View All
//           </Link>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : displayed.length === 0 ? (
//           <p>No grievances found</p>
//         ) : (
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
//                 <th className="px-6 py-4">Tracking ID</th>
//                 <th className="px-6 py-4">Description</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Priority</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Due</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               {displayed.slice(0, 10).map((g) => (
//                 <tr key={g._id} className="hover:bg-gray-50 transition">

//                   {/* Tracking ID */}
//                   <td className="px-6 py-4 text-xs font-mono text-gray-400">
//                     {g.trackingId}
//                   </td>

//                   {/* Description */}
//                   <td className="px-6 py-4">
//                     <p className="text-sm font-semibold text-gray-800">
//                       {g.text}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {g.city}, {g.area}
//                     </p>
//                   </td>

//                   {/* Category */}
//                   <td className="px-6 py-4">
//                     <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
//                       {g.category || "General"}
//                     </span>
//                   </td>

//                   {/* Priority */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <div
//                         className="w-2 h-2 rounded-full"
//                         style={{
//                           backgroundColor:
//                             g.priority === "High"
//                               ? "#10B981"
//                               : g.priority === "Medium"
//                               ? "#F59E0B"
//                               : "#EF4444",
//                         }}
//                       />
//                       <span className="text-sm font-medium">{g.priority}</span>
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td className="px-6 py-4">
//                     <span
//                       className={`text-xs px-3 py-1 rounded-lg font-medium ${
//                         g.status === "Resolved"
//                           ? "bg-green-50 text-green-700"
//                           : g.status === "Pending"
//                           ? "bg-yellow-50 text-yellow-700"
//                           : "bg-gray-50 text-gray-600"
//                       }`}
//                     >
//                       {g.status}
//                     </span>
//                   </td>

//                   {/* Due */}
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {g.action_within}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">

//         <div>
//           <h3 className="text-xl font-bold mb-2">
//             Need to Lodge a New Grievance?
//           </h3>
//           <p className="text-blue-100 text-sm">
//             Submit your complaint and get it resolved quickly with AI-powered routing.
//           </p>
//         </div>

//         <a
//           href="/dashboard/lodging"
//           className="bg-white text-blue-800 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md"
//         >
//           Lodge Grievance
//         </a>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  AlertCircle, Clock, CheckCircle2, TrendingUp, Users, FileText
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const API = "http://ugp-backend.onrender.com";

type StatType = {
  label: string;
  value: number | string;
  icon: any;
  color: string;
};

export const Dashboard = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userContact = localStorage.getItem("contact");
  const role = localStorage.getItem("role"); // set this at login
  const isAdmin = role === "admin";

  // 🔹 FETCH DATA
  useEffect(() => {
  const fetchData = async () => {
    try {
      let url = "";

      if (isAdmin) {
        url = `${API}/api/admin/all`;
      } else {
        if (!userContact) {
          console.warn("No contact found for citizen");
          setGrievances([]);
          setLoading(false);
          return;
        }

        url = `${API}/api/my-grievances?contact=${encodeURIComponent(userContact)}`;
      }

      console.log("FETCHING:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      console.log("RESPONSE:", data);

      setGrievances(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Fetch error:", err);
      setGrievances([]);
    }

    setLoading(false);
  };

  fetchData();
}, [role]);  // 🔥 IMPORTANT CHANGE

  const displayed = grievances;

  // 🔹 STATS
  const total = displayed.length;
  const pending = displayed.filter(g => g.status === "Pending").length;
  const resolved = displayed.filter(g => g.status === "Resolved").length;

  const stats: StatType[] = isAdmin
    ? [
        { label: "Total Grievances", value: total, icon: AlertCircle, color: "#1E40AF" },
        { label: "Pending", value: pending, icon: Clock, color: "#F59E0B" },
        { label: "Resolved", value: resolved, icon: CheckCircle2, color: "#10B981" },
        { label: "Users", value: new Set(displayed.map(g => g.contact)).size, icon: Users, color: "#8B5CF6" },
      ]
    : [
        { label: "My Grievances", value: total, icon: FileText, color: "#1E40AF" },
        { label: "Pending", value: pending, icon: Clock, color: "#F59E0B" },
        { label: "Resolved", value: resolved, icon: CheckCircle2, color: "#10B981" },
        { label: "Activity", value: total, icon: TrendingUp, color: "#EF4444" },
      ];

  // 🔹 CATEGORY CHART
  const categoryMap: Record<string, number> = {};
  displayed.forEach(g => {
    let category = (g.category || "General").trim().toLowerCase();
    category = category.charAt(0).toUpperCase() + category.slice(1);
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const chartData = Object.entries(categoryMap)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value); // sort descending

  // 🔹 PRIORITY CHART
  const priorityData = [
    { name: "High", value: displayed.filter(g => g.priority === "High").length, color: "#EF4444" },
    { name: "Medium", value: displayed.filter(g => g.priority === "Medium").length, color: "#F59E0B" },
    { name: "Low", value: displayed.filter(g => g.priority === "Low").length, color: "#10B981" },
  ].filter(p => p.value > 0);

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        {isAdmin ? "Admin Dashboard" : `Welcome back ${localStorage.getItem('ugp_user_name') || 'Citizen'}!`}
      </h1>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border shadow-sm"
          >
            <div
              className="p-3 rounded-xl w-fit mb-3"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon size={22} />
            </div>

            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">
              {loading ? "..." : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🔹 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Category Analysis</h3>

          {chartData.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0}/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1E40AF" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Priority */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Priority Distribution</h3>

          {priorityData.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={priorityData} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {isAdmin ? "All Grievances" : "My Grievances"}
          </h3>

          <Link
            to={isAdmin ? "/dashboard/all" : "/dashboard/my-grievances"}
            className="text-blue-600 text-sm"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="p-6">Loading...</p>
        ) : displayed.length === 0 ? (
          <p className="p-6">No grievances found</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase">
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due</th>
              </tr>
            </thead>

            <tbody>
              {displayed.slice(0, 10).map((g) => (
                <tr key={g._id} className="border-t">

                  <td className="px-6 py-4 text-xs text-gray-400">
                    {g.trackingId}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-semibold">{g.text}</p>
                    <p className="text-xs text-gray-400">
                      {g.city}, {g.area}
                    </p>
                  </td>

                  <td className="px-6 py-4">{g.category}</td>

                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color:
                          g.priority === "High"
                            ? "#EF4444"
                            : g.priority === "Medium"
                            ? "#F59E0B"
                            : "#10B981",
                      }}
                    >
                      {g.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">{g.status}</td>

                  <td className="px-6 py-4">{g.action_within}</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 CTA */}
      {!isAdmin && (
        <div className="bg-blue-800 text-white p-6 rounded-xl flex justify-between items-center">
          <div>
            <h3 className="font-bold">Need to lodge a grievance?</h3>
            <p className="text-sm">Submit and track easily</p>
          </div>

          <Link
            to="/dashboard/lodging"
            className="bg-white text-blue-800 px-4 py-2 rounded"
          >
            Lodge
          </Link>
        </div>
      )}

    </div>
  );
};
