
const readStoredValue = (key) => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(key);

  if (!value || value === "undefined" || value === "null") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Invalid localStorage value for ${key}:`, error);
    return null;
  }
};

export const fetchUser = () => {
  return readStoredValue("user");
};

export const userAccessToken = () => {
  return readStoredValue("accessToken");
};

// Waits for Firebase to restore the session, then returns a fresh ID token.
export const getIdToken = async () => {
  const { authentication } = await import("../firebase-config");
  const { onAuthStateChanged } = await import("firebase/auth");

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(authentication, (u) => {
      unsubscribe();
      resolve(u);
    });
  });

  return user ? user.getIdToken() : null;
};
