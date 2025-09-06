export const ROLES = {
  ADMIN: 'admin',
  AUTHOR: 'author',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];