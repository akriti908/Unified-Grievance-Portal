import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const API = "http://localhost:5000";

const PRIORITY_COLOR: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

const MyGrievances = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewing, setReviewing] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const userContact = localStorage.getItem("contact");

  // ✅ Load user grievances
  useEffect(() => {
    if (!userContact) return;

    fetch(`${API}/api/my-grievances?contact=${userContact}`)
      .then((res) => res.json())
      .then((data) => {
        setGrievances(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userContact]);

  // ⭐ Submit rating (optional backend feature)
  const submitReview = async () => {
    if (rating === 0) return;

    alert("⭐ Rating submitted (you can connect backend later)");

    setReviewing(null);
    setRating(0);
    setFeedback("");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Grievances</h1>
        <p className="text-gray-500 text-sm">
          Track and manage all your submitted grievances
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: grievances.length, color: "bg-blue-50 text-blue-800" },
          { label: "Pending", value: grievances.filter(g => g.status === "Pending").length, color: "bg-yellow-50 text-yellow-800" },
          { label: "Processing", value: grievances.filter(g => g.status === "Processing").length, color: "bg-blue-50 text-blue-800" },
          { label: "Resolved", value: grievances.filter(g => g.status === "Resolved").length, color: "bg-green-50 text-green-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : grievances.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No grievances found
          </div>
        ) : (
          <div className="divide-y">
            {grievances.map((g: any) => (
              <div key={g._id} className="p-5 hover:bg-gray-50 transition">

                <div className="flex justify-between items-start">

                  {/* LEFT */}
                  <div className="flex-1">

                    {/* Tags */}
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-mono">
                        {g.trackingId}
                      </span>

                      <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLOR[g.priority]}`}>
                        {g.priority}
                      </span>

                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[g.status]}`}>
                        {g.status}
                      </span>

                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {g.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-800 mb-2">{g.text}</p>

                    {/* Location */}
                    <p className="text-xs text-gray-500">
                      📍 {g.city}, {g.area}
                    </p>

                    {/* Image */}
                    {g.image && (
                      <img
                        src={`${API}/uploads/${g.image}`}
                        className="mt-3 max-h-48 object-cover rounded-xl"
                      />
                    )}

                  </div>

                  {/* RIGHT - RATE BUTTON */}
                  {g.status === "Resolved" && (
                    <button
                      onClick={() => setReviewing(g)}
                      className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-100"
                    >
                      ⭐ Rate
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⭐ Rating Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96">

            <h3 className="font-bold text-lg mb-2">Rate Resolution</h3>

            <p className="text-sm text-gray-500 mb-4">
              {reviewing.text}
            </p>

            {/* Stars */}
            <div className="flex gap-2 justify-center mb-4">
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s}
                  size={30}
                  onClick={() => setRating(s)}
                  className={
                    s <= rating
                      ? "text-yellow-400 fill-yellow-400 cursor-pointer"
                      : "text-gray-300 cursor-pointer"
                  }
                />
              ))}
            </div>

            {/* Feedback */}
            <textarea
              placeholder="Optional feedback..."
              className="w-full border p-2 rounded mb-3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={submitReview}
                className="flex-1 bg-yellow-400 text-white py-2 rounded-lg"
              >
                Submit
              </button>

              <button
                onClick={() => setReviewing(null)}
                className="px-4 border rounded-lg"
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

export default MyGrievances;