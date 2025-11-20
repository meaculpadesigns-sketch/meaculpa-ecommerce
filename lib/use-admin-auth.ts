import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firebase-helpers';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check if user is authenticated via username/password
    if (isAdminAuthenticated()) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Otherwise check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      if (user) {
        try {
          const userData = await getUserById(user.uid);
          if (!mounted) return;

          if (userData && userData.role === 'admin') {
            setIsAdmin(true);
            setLoading(false);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Admin auth error:', error);
          if (mounted) router.push('/');
        }
      } else {
        router.push('/admin/login');
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  return { loading, isAdmin };
}
