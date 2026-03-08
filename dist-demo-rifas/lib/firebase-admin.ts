/* eslint-disable */
// Mock Firebase Admin for Demo Mode
export const adminAuth = {
  verifyIdToken: async (token: string) => {
    // Simulamos que el token es válido para la demo (aunque no se usará)
    return { uid: "demo-user", role: "admin" } as any;
  },
};

export function adminDb() {
  return {} as any;
}

export function initAdmin() {
  // No hace nada
}
