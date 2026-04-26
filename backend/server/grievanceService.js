// const Grievance = require("./Grievance");
// const runPython = require("./pythonBridge");

// exports.createGrievance = async (body, file) => {
//   const { text, city, area, landmark, contact, anonymous } = body;

//   const category = await runPython("server/ai/categorizer.py", [text]);
//   const priority = await runPython("server/ai/priority.py", [text]);

//   const grievance = {
//     text,
//     city,
//     area,
//     landmark,
//     contact,
//     anonymous: anonymous === "true",
//     category,
//     priority,
//     image: file ? file.filename : null,
//     trackingId: "GR" + Math.floor(Math.random() * 100000),
//     status: "Pending",
//     createdAt: new Date()
//   };

//   return await Grievance.create(grievance);
// };

// exports.getAll = async () => {
//   return await Grievance.find();
// };

// exports.getMy = async (contact) => {
//   return await Grievance.find({
//     contact: { $regex: `^${contact}$`, $options: "i" }
//   });
// };

const Grievance = require("./Grievance");
const User = require("./User"); 
const {getCategory,getPriority} = require("./pythonBridge");
const {registerDuplicate } = require("./pythonBridge");

class GrievanceService {

  // ✅ CREATE
  async createGrievance(data, file) {
  const {
    text = "",
    city = "",
    area = "",
    landmark = "",
    contact = "",
    anonymous = false
  } = data;

  // ✅ normalize text (VERY IMPORTANT)
  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // 🔴 DB DUPLICATE CHECK
  const existing = await Grievance.findOne({
    text: { $regex: `^${cleanText}$`, $options: "i" },
    city: city.trim(),
    area: area.trim()
  });

  if (existing) {
    return {
      duplicate: true,
      details: {
        matched_with: existing.trackingId,
        similarity_score: 100
      }
    };
  }

  // 🔹 AI Calls
  let category = await getCategory(cleanText) || "General";

  category = category.trim();
  category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const priorityData = await getPriority(cleanText) || {
    priority: "Low",
    action_within: "7 days"
  };

  const newGrievance = {
    text: cleanText,
    city,
    area,
    landmark,
    contact: (anonymous === "true" || anonymous === true) ? null : contact.trim(),
    anonymous: anonymous === "true" || anonymous === true,
    category,
    priority: priorityData.priority,
    action_within: priorityData.action_within, // ✅ FIXED KEY
    image: file ? file.filename : null,
    trackingId: "GR" + Date.now().toString().slice(-6),
    status: "Pending",
    createdAt: new Date(),
  };

  const saved = await Grievance.create(newGrievance);

  // (optional) keep Python register if you want
  await registerDuplicate(cleanText, saved.trackingId);

  return saved;
}

  

  // ADMIN: get ALL
  async getAllGrievances() {
    return await Grievance.find().sort({ createdAt: -1 });
  }

  // USER: get ONLY THEIR grievances
  async getUserGrievances(contact) {
    if (!contact) return [];

    return await Grievance.find({
      contact: contact.trim()   
    }).sort({ createdAt: -1 });
  }

  async getByTrackingId(id) {
    return await Grievance.findOne({
      trackingId: { $regex: `^${id.trim()}$`, $options: "i" }
    });
  }

  async updateStatus(trackingId, status, remark) {
    const grievance = await Grievance.findOne({ trackingId });

    if (!grievance) return null;

    grievance.status = status;

    // ⭐ IMPORTANT: store remarks as array
    if (remark) {
      if (!grievance.remarks) grievance.remarks = [];
      grievance.remarks.push(remark);
    }

    await grievance.save();
    return grievance;
  }

  async assignOfficer(trackingId, name, phone, note) {
      const grievance = await Grievance.findOne({ trackingId });

      if (!grievance) return null;

      grievance.officer_name = name;
      grievance.officer_phone = phone;
      grievance.officer_note = note;

      await grievance.save();
      return grievance;
    }

    async submitReview(trackingId, rating, feedback) {
      return await Grievance.findOneAndUpdate(
        { trackingId },
        { rating, feedback },
        { new: true }
      );
    }

  async getAnalytics() {
  const grievances = await Grievance.find();

  const total = grievances.length;

  let resolved = 0;
  let pending = 0;
  let processing = 0;

  const categoryMap = {};
  const locationMap = {};
  const officerMap = {};

  let ratingSum = 0;
  let ratingCount = 0;

  grievances.forEach(g => {
    // ✅ STATUS
    if (g.status === "Resolved") resolved++;
    else if (g.status === "Pending") pending++;
    else if (g.status === "Processing") processing++;

    // ✅ CATEGORY
    const category = (g.category || "General").trim();

    if (!categoryMap[category]) {
      categoryMap[category] = { total: 0, resolved: 0, ratings: [] };
    }

    categoryMap[category].total++;

    if (g.status === "Resolved") {
      categoryMap[category].resolved++;
    }

    if (g.rating) {
      categoryMap[category].ratings.push(g.rating);
      ratingSum += g.rating;
      ratingCount++;
    }

    // ✅ LOCATION
    const location = g.area || g.city || "Unknown";

    if (!locationMap[location]) {
      locationMap[location] = { total: 0, resolved: 0 };
    }

    locationMap[location].total++;

    if (g.status === "Resolved") {
      locationMap[location].resolved++;
    }

    // ✅ OFFICER
    if (g.officer_name) {
      if (!officerMap[g.officer_name]) {
        officerMap[g.officer_name] = {
          phone: g.officer_phone || "N/A",
          assigned: 0,
          resolved: 0,
          ratings: []
        };
      }

      officerMap[g.officer_name].assigned++;

      if (g.status === "Resolved") {
        officerMap[g.officer_name].resolved++;
      }

      if (g.rating) {
        officerMap[g.officer_name].ratings.push(g.rating);
      }
    }
  });
  return {
    total,
    resolved,
    pending,
    processing,
    categoryMap,
    locationMap,
    officerMap,
    averageRating: ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 0
  };
}
async getSettings() {
  return {
    appName: "UGP",
    helpline: "1800-11-0031"
  };
}

async updateSettings(data) {
  // later you can store in DB
  return {
    message: "Settings saved",
    data
  };
}


// ✅ GET ALL USERS (no passwords)
async getAllUsers() {
  return await User.find().select("-password"); // hides password
}
}

module.exports = new GrievanceService();