// Decode Base64URL 
const base64UrlDecode = (str) => {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
};

export const isTokenValid = () => {
  const jwt = localStorage.getItem("user_token");
  if (!jwt) return false;

  const token = jwt.replace(/"/g, ""); // remove quotes if stored as string only

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const payload = base64UrlDecode(parts[1]);
  if (!payload || !payload.exp) return false;

  const now = Math.floor(Date.now() / 1000); // current UNIX seconds

  return now < payload.exp; // valid if current < exp
};
