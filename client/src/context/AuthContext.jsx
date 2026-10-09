import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/endpoints.js';
import { tokenStore } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!tokenStore.get());

  useEffect(() => {
    if (!tokenStore.get()) return;
    authApi.me()
      .then((d) => setUser(d.user))
      .catch((e) => { if (e.status === 401) tokenStore.set(null); })
      .finally(() => setReady(true));
  }, []);

  const finishAuth = useCallback(({ token, user: u }) => {
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const login = useCallback((name, pass) => authApi.login(name, pass).then(finishAuth), [finishAuth]);
  const register = useCallback((name, pass) => authApi.register(name, pass).then(finishAuth), [finishAuth]);
  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    tokenStore.set(null);
    setUser(null);
  }, []);
  const refresh = useCallback(() => authApi.me().then((d) => setUser(d.user)).catch(() => {}), []);

  const value = useMemo(() => ({ user, ready, login, register, logout, refresh }), [user, ready, login, register, logout, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
