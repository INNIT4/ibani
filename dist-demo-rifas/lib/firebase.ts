/* eslint-disable */
// Mock Firebase for Demo Mode
export const db = {} as any;
export const auth = {
  onAuthStateChanged: (callback: any) => {
    // Simulamos un usuario admin logueado para la demo
    callback({ uid: "demo-user", email: "admin@demo.com", displayName: "Admin Demo" });
    return () => {};
  },
  currentUser: { uid: "demo-user", email: "admin@demo.com", displayName: "Admin Demo" },
  signOut: async () => {}
} as any;
const app = {} as any;
export default app;
