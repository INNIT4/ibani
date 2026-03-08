// Mock Session for Demo Mode
export async function signSession(uid: string, role: string = "admin"): Promise<string> {
  return "demo-session-token";
}

export async function verifySession(cookie: string): Promise<{ uid: string; role: string } | null> {
  // Siempre devolvemos un admin para que puedan ver el panel de control en la demo
  return { uid: "demo-admin", role: "admin" };
}
