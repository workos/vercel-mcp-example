import { signOut } from '@workos-inc/authkit-nextjs';

export const GET = async () => {
  // This helper deletes the session cookie and redirects.
  await signOut({ returnTo: '/' });
}; 