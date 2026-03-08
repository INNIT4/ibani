/* eslint-disable */
// Mock Firebase for Demo Mode
export const db = {} as any;
export const auth = {
  onAuthStateChanged: (callback: any) => {
    // Simulamos que no hay nadie logueado para la demo pública
    callback(null);
    return () => {};
  }
} as any;
const app = {} as any;
export default app;
