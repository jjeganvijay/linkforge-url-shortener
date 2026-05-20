import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import { ensureCsrfToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  useEffect(() => {
    ensureCsrfToken()
      .catch(() => {
        // ok to continue without CSRF token; server will enforce only for cookie-auth mutations
      })
      .finally(() => {
        api
          .get("/auth/me")
          .then((res) => {
            setUser(res.data.data.user);
          })
          .catch(() => {
            clearSession();
          })
          .finally(() => setLoading(false));
      });
  }, [clearSession]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data.data.user;
    setUser(userData);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    const userData = res.data.data.user;
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore, clear client session anyway
    }
    clearSession();
  };

  const loginWithGoogle = async (credential) => {
    const res = await api.post('/auth/google', { credential });
    const userData = res.data.data.user;
    setUser(userData);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        clearSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
