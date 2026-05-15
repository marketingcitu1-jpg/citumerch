import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || '',
          });
        }
      } catch (err) {
        console.error('[v0] Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || '',
        });
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            department: data.department,
            role: data.role,
            employee_id: data.employeeId,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          email: data.email,
          full_name: data.name,
          role: data.role,
        },
      ]);

      if (profileError && profileError.code !== 'PGRST110') throw profileError;

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('[v0] Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
