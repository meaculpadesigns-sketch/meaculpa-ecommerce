// Admin authentication with username/password
// Passwords are hashed with SHA-256 for basic security

import { signInAnonymously, signOut } from 'firebase/auth';
import { auth } from './firebase';

interface AdminCredential {
  username: string;
  passwordHash: string;
  displayName: string;
}

// Pre-configured admin users with SHA-256 hashed passwords
const ADMIN_USERS: AdminCredential[] = [
  {
    username: 'meaculpa',
    passwordHash: 'eff610daacb8149e9e8838baa110ba82af220b5a78c0436803ccd07f0cb8e7bc',
    displayName: 'Mea Culpa Admin',
  },
  {
    username: 'mali',
    passwordHash: '32e020d80000b8eecfc8e10a0dd6d6bfc8112c471c6e6777318ec50c09746658',
    displayName: 'Mali Admin',
  },
  {
    username: 'övet',
    passwordHash: '9053e9ad9b46dac2fb4207bff9ce56e5b3c5457442d48191e9692d74ae67117e',
    displayName: 'Övet Admin',
  },
];

// Simple hash function (SHA-256 would be better in production)
async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side - use crypto
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
  } else {
    // Client-side - use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(password);
    const admin = ADMIN_USERS.find(
      a => a.username.toLowerCase() === username.toLowerCase() && a.passwordHash === passwordHash
    );

    if (admin) {
      // Store admin session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', JSON.stringify({
          username: admin.username,
          displayName: admin.displayName,
          timestamp: Date.now(),
        }));

        // Sign in to Firebase Auth anonymously to enable Storage uploads
        // Try multiple times with delay for Chrome compatibility
        let signInSuccess = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await signInAnonymously(auth);
            console.log('✅ Admin signed in to Firebase Auth for storage access');
            signInSuccess = true;
            break;
          } catch (firebaseError: any) {
            console.error(`⚠️ Firebase Auth sign-in attempt ${attempt + 1} failed:`, firebaseError?.message);
            if (attempt < 2) {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }

        if (!signInSuccess) {
          console.error('⚠️ All Firebase Auth sign-in attempts failed. Storage uploads may not work.');
          alert('Uyarı: Firebase Auth başarısız oldu. Görseller yüklenemeyebilir. Lütfen sayfayı yenileyip tekrar deneyin.');
        }
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Admin auth error:', error);
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const adminAuth = sessionStorage.getItem('adminAuth');
  if (!adminAuth) return false;

  try {
    const auth = JSON.parse(adminAuth);
    // Session expires after 24 hours
    const isValid = Date.now() - auth.timestamp < 24 * 60 * 60 * 1000;
    if (!isValid) {
      sessionStorage.removeItem('adminAuth');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getAdminInfo(): { username: string; displayName: string } | null {
  if (typeof window === 'undefined') return null;

  const adminAuth = sessionStorage.getItem('adminAuth');
  if (!adminAuth) return null;

  try {
    return JSON.parse(adminAuth);
  } catch {
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminAuth');

    // Sign out from Firebase Auth as well
    try {
      await signOut(auth);
      console.log('✅ Admin signed out from Firebase Auth');
    } catch (error) {
      console.error('⚠️ Firebase Auth sign-out failed:', error);
    }
  }
}
