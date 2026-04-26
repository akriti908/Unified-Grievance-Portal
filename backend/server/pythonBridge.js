// const { spawn } = require("child_process");

// const runPython = (file, args = []) => {
//   return new Promise((resolve, reject) => {
//     const process = spawn("python", [file, ...args]);

//     let result = "";

//     process.stdout.on("data", (data) => {
//       result += data.toString();
//     });

//     process.stderr.on("data", (err) => {
//       console.error(err.toString());
//     });

//     process.on("close", () => {
//       resolve(result.trim());
//     });
//   });
// };

// module.exports = runPython;

const { spawn } = require("child_process");
const path = require("path");

function runPython(file, args = []) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, "ai", file);

    const process = spawn("python", [scriptPath, ...args]);

    let result = "";

    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });

    process.on("close", () => {
      resolve(result.trim());
    });
  });
}

// ✅ CATEGORY
exports.getCategory = async (text) => {
  const result = await runPython("categorizer.py", [text]);
  return result || "General";
};

// ✅ PRIORITY
exports.getPriority = async (text) => {
  const result = await runPython("priority.py", [text]);
  const [priority, action_within] = result.split("|");

  return {
    priority: priority || "Low",
    action_within: action_within || "7 days",
  };
};

// ✅ DUPLICATE CHECK
exports.checkDuplicate = async (text) => {
  const result = await runPython("duplicate.py", ["check", text]);

  try {
    return JSON.parse(result);
  } catch {
    return { is_duplicate: false };
  }
};

exports.registerDuplicate = async (text, trackingId) => {
  await runPython("duplicate.py", ["register", text, trackingId]);
};

// ✅ LOCATION INFO
exports.getLocationInfo = async (state, district, pincode, category) => {
  const result = await runPython("location.py", [
    state || "",
    district || "",
    pincode || "",
    category || "",
  ]);

  try {
    return JSON.parse(result);
  } catch {
    return {};
  }
};