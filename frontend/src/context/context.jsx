import React, { createContext, useState, useEffect } from "react";

export const Context = createContext();

export const Provider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          setIsLoggedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsLoggedIn);
        }
      }
    };

    if (gapiLoaded) {
      checkAuth();
    }
  }, [gapiLoaded]);

  const loadGapiClient = () => {
    if (gapiLoaded && window.gapi) {
      window.gapi.load("client:auth2", () => {
        window.gapi.auth2
          .init({
            client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com", // Replace with your actual Client ID
          })
          .then(() => {
            console.log("Google Auth Initialized");
          });
      });
    }
  };

  return (
    <Context.Provider value={{ isLoggedIn, setGapiLoaded, loadGapiClient }}>
      {children}
    </Context.Provider>
  );
};
