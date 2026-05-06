/**
 * Protected paths configuration for middleware
 * Note: In next-auth v4, middleware protection is handled differently
 * Use this config with next-auth/middleware if needed
 */
export const protectedPaths = [
  /\/checkout(\/.*)?/,
  /\/account(\/.*)?/,
  /\/admin(\/.*)?/,
];

const authConfig = {
  protectedPaths,
};

export default authConfig;