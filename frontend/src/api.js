const API_BASE = "http://localhost:5000";

export async function checkAuthService() {
  const res = await fetch(`${API_BASE}`);
  return res.text();
}
