import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Use default database as configured
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export let OperationType = /*#__PURE__*/ (function (OperationType) {
  OperationType["CREATE"] = "create";
  OperationType["UPDATE"] = "update";
  OperationType["DELETE"] = "delete";
  OperationType["LIST"] = "list";
  OperationType["GET"] = "get";
  OperationType["WRITE"] = "write";
  return OperationType;
})({});

export function handleFirestoreError(error, operation, path) {
  if (
    error &&
    (error.code === "permission-denied" ||
      (error.message && error.message.includes("permission-denied")))
  ) {
    const errorInfo = {
      error: "Missing or insufficient permissions",
      operation: operation,
      path: path,
      authenticated: auth.currentUser !== null,
      userId: auth.currentUser?.uid || null,
      timestamp: new Date().toISOString(),
    };
    console.error(
      "Firestore Permission Denied Info:",
      JSON.stringify(errorInfo, null, 2),
    );
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = () => auth.signOut();
