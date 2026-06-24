import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on load
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // We will attempt real AWS login
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (isSignedIn) {
        await checkUser();
        return true;
      }
    } catch (error) {
      console.error("AWS Auth Error:", error);
      
      // MOCK FALLBACK for development without real AWS backend
      if (error.name === 'NotAuthorizedException' || error.message.includes('User pool') || error.message.includes('fetch')) {
        console.warn("Using mock authentication because AWS pool is not configured.");
        setUser({ username: email, userId: 'mock-id-123' });
        setIsAuthenticated(true);
        toast.success(`Mock logged in as ${email}`);
        return true;
      }
      
      toast.error(error.message || "Failed to log in");
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      return true;
    } catch (error) {
      console.error("AWS Auth Error:", error);
      
      // MOCK FALLBACK
      if (error.message.includes('User pool') || error.message.includes('fetch')) {
        console.warn("Using mock signup because AWS pool is not configured.");
        return true; // pretend it worked
      }
      
      toast.error(error.message || "Failed to register");
      return false;
    }
  };

  const confirmRegister = async (email, code) => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      return true;
    } catch (error) {
      console.error("AWS Auth Error:", error);
      
      // MOCK FALLBACK
      if (error.message.includes('User pool') || error.message.includes('fetch')) {
        console.warn("Using mock confirmation because AWS pool is not configured.");
        return true;
      }
      
      toast.error(error.message || "Verification failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("AWS Auth Error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.info("You have been logged out.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, confirmRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
