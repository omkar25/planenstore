// Admin navigation links configuration with translation keys
export const adminLinks = [
  {
    titleKey: 'admin.nav.overview',
    href: '/admin/overview',
  },
  {
    titleKey: 'admin.nav.categories',
    href: '/admin/categories',
  },
  {
    titleKey: 'admin.nav.products',
    href: '/admin/products',
  },
  {
    titleKey: 'admin.nav.orders',
    href: '/admin/orders',
  },
  {
    titleKey: 'admin.nav.users',
    href: '/admin/users',
  },
  {
    titleKey: 'admin.nav.pages',
    href: '/admin/web-pages',
  },
  {
    titleKey: 'admin.nav.carousels',
    href: '/admin/carousels',
  },
  {
    titleKey: 'admin.nav.settings',
    href: '/admin/settings',
  },
]

// Type definition for admin link
export interface AdminLink {
  titleKey: string
  href: string
}
