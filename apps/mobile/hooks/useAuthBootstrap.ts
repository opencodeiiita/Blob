import { useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { useAuthStore } from '@/store/authStore';

export function useAuthBootstrap() {
  const initialize = useAuthStore((state) => state.initialize);
  const setUserFromSession = useAuthStore((state) => state.setUserFromSession);
  const logout = useAuthStore((state) => state.logout);
  const finishLoading = useAuthStore((state) => state.finishLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  const { refetch: refetchMe } = trpc.getMe.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const token = await initialize();
        if (!isActive) return;

        if (!token) {
          return;
        }

        const result = await refetchMe();
        const user = result.data?.user;

        if (user) {
          await setUserFromSession(user);
        } else {
          await logout();
        }
      } catch {
        await logout();
      } finally {
        if (isActive) {
          finishLoading();
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [finishLoading, initialize, logout, refetchMe, setUserFromSession]);

  return { isBootstrapping: isLoading };
}
