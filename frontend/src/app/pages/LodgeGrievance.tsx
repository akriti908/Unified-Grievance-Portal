import React, { useState } from "react";

const API = 'http://localhost:5000/api';

const LodgeGrievance = () => {
  const [formData, setFormData] = useState({
    text: "",
    city: "",
    area: "",
    landmark: "",
    contact: "",
    anonymous: false,
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 🔹 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formPayload = new FormData();

      formPayload.append("text", formData.text.trim());
      formPayload.append("city", formData.city.trim());
      formPayload.append("area", formData.area.trim());
      formPayload.append("landmark", formData.landmark.trim());
      formPayload.append("contact", formData.contact.trim());
      formPayload.append("anonymous", String(formData.anonymous));

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const res = await fetch(`${API}/grievance`, {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      // 🔴 HANDLE DUPLICATE HERE
      // 🚀 Handles AI + duplicate response from backend
      if (data.duplicate) {
        setResult({
          duplicate: true,
          message: data.message,
          details: data.details
        });
        setLoading(false);
        return;
      }

      // ❌ normal error
      if (!res.ok) throw new Error("Server error");

      // ✅ success
      setResult(data);

      localStorage.setItem("contact", formData.contact || "guest");

      // reset
      setFormData({
        text: "",
        city: "",
        area: "",
        landmark: "",
        contact: "",
        anonymous: false,
        image: null,
      });

      setPreview(null);

    } catch (err) {
      console.error(err);
      setResult({ error: true });
    }

    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">
          Lodge Grievance
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Fill details to submit your grievance
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Description */}
          <div>
            <label className="font-semibold">Grievance Details *</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>

          {/* Location */}
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area / Locality"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Landmark (optional)"
            className="w-full p-3 border rounded-lg"
          />

          {/* Upload */}
          <div>
            <label className="font-semibold block mb-2">
              Upload Image (optional)
            </label>

            <div className="border-2 border-dashed p-6 text-center rounded-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                Click to upload
              </label>
            </div>

            {preview && (
              <img src={preview} className="mt-3 max-h-60 rounded" />
            )}
          </div>

          {/* Contact */}
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full p-3 border rounded-lg"
          />

          {/* Anonymous */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            <label>Submit anonymously</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </form>

        {/* RESULT */}
        {result && !result.error && !result.duplicate && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
            <p className="font-bold text-green-800 text-lg mb-1">Grievance Submitted Successfully!</p>
            <p className="text-green-700 font-mono text-xl font-bold mb-3">{result.trackingId}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
              <div>Category: <b>{result.category}</b></div>
              <div>Priority: <b>{result.priority}</b></div>
              <div>Due in: <b>{result.action_within}</b></div>
              <div>Status: <b>{result.status}</b></div>
              <div className="col-span-2">Location: <b>{result.city}, {result.area}</b></div>
            </div>
          </div>
        )}

        {result?.duplicate && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
            <p className="font-bold text-yellow-800">Duplicate Detected</p>
            <p className="text-yellow-700">Similar to <b>{result.details?.matched_with}</b>({result.details?.similarity_score}% match)</p>
          </div>
        )}

        {result?.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Failed to submit. Make sure the backend is running at port 5000.
          </div>
        )}
      </div>
    </div>
  );
};

export default LodgeGrievance;