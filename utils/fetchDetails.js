export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  return userInfo;
};

export const userAccessToken = () => {
  const accessToken =
    localStorage.getItem("accessToken") !== "undefined"
      ? JSON.parse(localStorage.getItem("accessToken"))
      : localStorage.clear();

  return accessToken;
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
