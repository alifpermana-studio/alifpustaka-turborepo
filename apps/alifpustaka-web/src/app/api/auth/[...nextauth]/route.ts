import NextAuth from 'next-auth';
import { authOptions } from './authOptions'; // must export a plain object

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
