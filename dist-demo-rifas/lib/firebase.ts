/* eslint-disable */
// Mock Firebase for Demo Mode
export const db = {} as any;
const DEMO_USER = { 
  uid: "demo-user", 
  email: "admin@demo.com", 
  displayName: "Admin Demo",
  getIdToken: async () => "demo-token"
};

export const auth = {
  onAuthStateChanged: (callback: any) => {
    // Simulamos un usuario admin logueado para la demo
    callback(DEMO_USER);
    return () => {};
  },
  currentUser: DEMO_USER,
  signOut: async () => {}
} as any;
const app = {} as any;
export default app;
