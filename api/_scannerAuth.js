const crypto = require("crypto");

function isScannerAuthorized(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expected = process.env.SCANNER_API_KEY || "";

  if (!expected || !token || token.length !== expected.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

module.exports = { isScannerAuthorized };
