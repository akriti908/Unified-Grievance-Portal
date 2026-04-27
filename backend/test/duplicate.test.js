const axios = require("axios");

const BASE_URL = "https://unified-grievance-portal.onrender.com";

async function submitGrievance(text) {
  return axios.post(`${BASE_URL}/api/grievance`, {
    text,
    area: "Delhi",
    city: "Delhi",
    contact: "9999999999",
    anonymous: false
  });
}

async function testDuplicateDetection() {
  try {
    console.log("🧪 TEST: Duplicate Grievance Detection\n");

    const grievanceText = "Street light not working in my area";

    console.log("➡️ FIRST submission...");
    const res1 = await submitGrievance(grievanceText);
    console.log("✅ First:", res1.data);

    console.log("\n➡️ DUPLICATE submission...");
    const res2 = await submitGrievance(grievanceText);
    console.log("✅ Second:", res2.data);

    console.log("\n🎯 TEST COMPLETED");

  } catch (err) {
    console.log("❌ ERROR DETAILS:");
    console.log(err.response?.data || err.message);
  }
}

testDuplicateDetection();