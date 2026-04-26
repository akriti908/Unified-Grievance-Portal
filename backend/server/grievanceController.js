// const service = require("./grievanceService");

// exports.submit = async (req, res) => {
//   try {
//     const data = await service.createGrievance(req.body, req.file);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Submission failed" });
//   }
// };

// exports.getAll = async (req, res) => {
//   const data = await service.getAll();
//   res.json(data);
// };

// exports.getMy = async (req, res) => {
//   const { contact } = req.query;
//   if (!contact) return res.json([]);

//   const data = await service.getMy(contact);
//   res.json(data);
// };

const grievanceService = require("./grievanceService");

class GrievanceController {

  async trackById(req, res) {
    try {
      const { id } = req.params;

      const data = await grievanceService.getByTrackingId(id);

      if (!data) {
        return res.json({ error: "Not found" });
      }

      console.log("TRACK HIT:", id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to track grievance" });
    }
  }

  async submitReview(req, res) {
    try {
      const { trackingId, rating, feedback } = req.body;

      const updated = await grievanceService.submitReview(
        trackingId,
        rating,
        feedback
      );

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  }

  async submitGrievance(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.body) {
      return res.status(400).json({ error: "No data received" });
    }

    const result = await grievanceService.createGrievance(
      req.body,
      req.file || null
    );

    // 🔴 HANDLE DUPLICATE RESPONSE
    if (result.duplicate) {
      return res.status(200).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);   // ✅ VERY IMPORTANT
    res.status(500).json({ error: err.message });
  }
}

  async updateStatus(req, res) {
    try {
      const { trackingId, status, remark } = req.body;

      const updated = await grievanceService.updateStatus(
        trackingId,
        status,
        remark
      );

      if (!updated) {
        return res.status(404).json({ error: "Grievance not found" });
      }

      res.json({ message: "Status updated successfully", data: updated });
    } catch (err) {
      console.error("Update Status Error:", err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }

  async assignOfficer(req, res) {
    try {
      const { trackingId, officer_name, officer_phone, officer_note } = req.body;

      const updated = await grievanceService.assignOfficer(
        trackingId,
        officer_name,
        officer_phone,
        officer_note
      );

      if (!updated) {
        return res.status(404).json({ error: "Grievance not found" });
      }

      res.json({ message: "Officer assigned successfully", data: updated });
    } catch (err) {
      console.error("Assign Officer Error:", err);
      res.status(500).json({ error: "Failed to assign officer" });
    }
  }

  async getAll(req, res) {
    try {
      const data = await grievanceService.getAllGrievances();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch grievances" });
    }
  }

  async getMyGrievances(req, res) {
    try {
      const { contact } = req.query;

      const data = await grievanceService.getUserGrievances(contact);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user grievances" });
    }
  }

  async getAnalytics(req, res) {
    try {
      const data = await grievanceService.getAnalytics();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }

  async getSettings(req, res) {
    try {
      const data = await grievanceService.getSettings();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  }

  async updateSettings(req, res) {
    try {
      const data = await grievanceService.updateSettings(req.body);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await grievanceService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
}

module.exports = new GrievanceController();