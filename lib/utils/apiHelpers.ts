import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';

/**
 * Get the display name of the currently authenticated user
 * @param request NextRequest object
 * @returns User's name, email, or 'System' as fallback
 */
export async function getUserDisplayName(request: NextRequest): Promise<string> {
  const user = getUserFromHeaders(request);
  
  if (!user) {
    return 'System';
  }

  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { name: true, email: true }
    });

    if (userRecord) {
      return userRecord.name || userRecord.email;
    }
    
    // Fallback to email from headers if user record not found
    return user.email || 'System';
  } catch (err) {
    console.error('Error fetching user record:', err);
    return user.email || 'System';
  }
}
