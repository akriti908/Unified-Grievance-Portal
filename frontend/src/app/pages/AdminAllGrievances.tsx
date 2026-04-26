// 🛠️ Admin feature: improved grievance management workflow
import React, { useEffect, useState } from "react";

const API = "/api";

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
const PRIORITY_COLOR: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-red-100 text-red-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Resolved: "bg-green-100 text-green-800",
};

const AdminAllGrievances = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"priority" | "category" | "district">("priority");
  // ✅ ADMIN REVIEW STATES
  const [reviewing, setReviewing] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerPhone, setOfficerPhone] = useState("");
  const [officerNote, setOfficerNote] = useState("");

  // ✅ LOAD DATA
  function load() {
    fetch(`${API}/admin/all`)
      .then((res) => res.json())
      .then((resData) => {
        const list = Array.isArray(resData) ? resData : [];

        const sorted = list.sort(
          (a, b) =>
            (PRIORITY_ORDER[a.priority] ?? 3) -
            (PRIORITY_ORDER[b.priority] ?? 3)
        );

        setData(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const groupGrievances = (list: any[]) => {
  const grouped: Record<string, any[]> = {};

  list.forEach((g) => {
    let key = "";

    if (groupBy === "priority") {
      key = g.priority || "Unknown";
    } else if (groupBy === "category") {
      key = g.category || "General";
    } else if (groupBy === "district") {
      key = g.area || g.city || "Unknown";
    }

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(g);
  });

  return grouped;
};

const groupedData = groupGrievances(data);

const sortedGroups = Object.keys(groupedData).sort((a, b) => {
  if (groupBy === "priority") {
    return (PRIORITY_ORDER[a] ?? 3) - (PRIORITY_ORDER[b] ?? 3);
  }
  return a.localeCompare(b);
});

  // ✅ UPDATE STATUS (MAIN LOGIC)
  async function updateStatus() {
    if (!reviewing) return;

    await fetch(`${API}/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingId: reviewing.trackingId, // ✅ FIXED KEY
        status: newStatus,
        remark,
      }),
    });

    // assign officer
    if (officerName && officerPhone) {
      await fetch(`${API}/assign-officer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingId: reviewing.trackingId,
          officer_name: officerName,
          officer_phone: officerPhone,
          officer_note: officerNote,
        }),
      });
    }

    // reset
    setReviewing(null);
    setRemark("");
    setOfficerName("");
    setOfficerPhone("");
    setOfficerNote("");

    load();
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        All Grievances
      </h1>
      <div className="flex items-center gap-4 mb-6">

  <span className="text-gray-600 font-medium">
    Group by:
  </span>

  {/* Priority */}
  <button
    onClick={() => setGroupBy("priority")}
    className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
      groupBy === "priority"
        ? "bg-blue-700 text-white border-blue-700"
        : "border-gray-400 text-black hover:bg-gray-100"
    }`}
  >
    Priority
  </button>

  {/* Category */}
  <button
    onClick={() => setGroupBy("category")}
    className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
      groupBy === "category"
        ? "bg-blue-700 text-white border-blue-700"
        : "border-gray-400 text-black hover:bg-gray-100"
    }`}
  >
    Category
  </button>

  {/* District */}
  <button
    onClick={() => setGroupBy("district")}
    className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
      groupBy === "district"
        ? "bg-blue-700 text-white border-blue-700"
        : "border-gray-400 text-black hover:bg-gray-100"
    }`}
  >
    District
  </button>

</div>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No grievances found</p>
      ) : (
      <div className="grid gap-6">
          {sortedGroups.map((group) => (
            <div key={group}>

              {/* GROUP TITLE */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                  {group}
                </h2>

                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {groupedData[group].length} cases
                </span>
              </div>

              {/* ITEMS */}
              {groupedData[group].map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition duration-200 mb-4">

                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="font-semibold text-lg text-blue-700">
                        {item.trackingId}
                      </h2>

                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        STATUS_COLOR[item.status] || "bg-gray-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* TAGS */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        PRIORITY_COLOR[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>

                    {item.category && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    )}

                    {item.officer_name && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Officer Assigned
                      </span>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">
                    {item.text || "No details provided"}
                  </p>

                  {/* LOCATION */}
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>📍 {item.area || "N/A"}, {item.city || "N/A"}</p>

                    {!item.anonymous && item.contact && (
                      <p>📞 {item.contact}</p>
                    )}
                  </div>

                  {item.anonymous && (
                    <p className="text-sm text-gray-500 italic">
                      Submitted anonymously
                    </p>
                  )}

                  {/* IMAGE */}
                  {item.image ? (
                    <img
                      src={`${API}/uploads/${item.image}`}
                      className="mt-3 max-h-60 object-cover rounded"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <p className="text-sm text-gray-400">No image uploaded</p>
                  )}

                  {/* DATE */}
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  {/* REVIEW BUTTON */}
                  <button
                    onClick={() => {
                      setReviewing(item);
                      setNewStatus(item.status || "Submitted");
                      setOfficerName(item.officer_name || "");
                      setOfficerPhone(item.officer_phone || "");
                      setOfficerNote(item.officer_note || "");
                    }}
                    className="mt-3 bg-blue-50 hover:bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                    Review
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ✅ REVIEW MODAL (UPDATED UI EXACT LIKE SCREENSHOT) */}
{reviewing && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    onClick={() => setReviewing(null)}
  >
    <div
      className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <h3 className="font-bold text-lg mb-1">Review Grievance</h3>
      <p className="text-xs font-mono text-gray-400 mb-3">
        {reviewing.trackingId}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded-xl">
        {reviewing.text}
      </p>

      {/* INFO BOX */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-blue-50 rounded-xl">
        <div><b>Category:</b> {reviewing.category}</div>
        <div><b>Priority:</b> {reviewing.priority}</div>
        <div><b>Location:</b> {reviewing.area}, {reviewing.city}</div>
        <div><b>Due in:</b> {reviewing.action_within || "N/A"}</div>
      </div>

      {/* STATUS */}
      <label className="block text-sm font-medium mb-1">Update Status</label>
      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="w-full border rounded-xl p-2 mb-3 text-sm"
      >
        {["Submitted", "Processing", "Resolved"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* REMARK */}
      <label className="block text-sm font-medium mb-1">
        Remark for Citizen
      </label>
      <textarea
        placeholder="Describe how the issue is being addressed..."
        className="w-full border rounded-xl p-2 text-sm mb-4"
        rows={2}
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />

      {/* OFFICER SECTION */}
      <div className="border-t pt-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Assign Field Officer
        </p>

        <div className="space-y-2">
          <input
            placeholder="Officer full name"
            className="w-full border rounded-xl p-2 text-sm bg-gray-50"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
          />

          <input
            placeholder="Officer phone number"
            className="w-full border rounded-xl p-2 text-sm bg-gray-50"
            value={officerPhone}
            onChange={(e) => setOfficerPhone(e.target.value)}
          />

          <input
            placeholder="Note e.g. Will visit on Monday 10am"
            className="w-full border rounded-xl p-2 text-sm bg-gray-50"
            value={officerNote}
            onChange={(e) => setOfficerNote(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={updateStatus}
          className="flex-1 bg-blue-800 text-white py-2 rounded-xl font-medium hover:bg-blue-700"
        >
          Update & Save
        </button>

        <button
          onClick={() => setReviewing(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            groupBy === "priority"
              ? "bg-blue-700 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      
    </div>
  );
};

export default AdminAllGrievances;
