'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { adminLinks } from './admin-links';
import { AuthTokenService } from '@/services/api-config';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Images, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ReactNode> = {
  '/admin/overview': <LayoutDashboard className="w-5 h-5" />,
  '/admin/categories': <FolderTree className="w-5 h-5" />,
  '/admin/products': <Package className="w-5 h-5" />,
  '/admin/orders': <ShoppingCart className="w-5 h-5" />,
  '/admin/users': <Users className="w-5 h-5" />,
  '/admin/web-pages': <FileText className="w-5 h-5" />,
  '/admin/carousels': <Images className="w-5 h-5" />,
  '/admin/settings': <Settings className="w-5 h-5" />,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapse

  const handleLogout = async () => {
    // Remove auth_token from localStorage
    AuthTokenService.removeToken();
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  const isActiveLink = (href: string) => {
    return pathname?.includes(href);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/admin/overview" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:block">{t('admin.panelTitle')}</span>
            </Link>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(session?.user as { role?: string })?.role || 'Administrator'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-primary text-white rounded-full items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className={`p-4 space-y-2 ${sidebarCollapsed ? 'lg:p-2' : ''}`}>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? t(link.titleKey) : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
              } ${
                isActiveLink(link.href)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {iconMap[link.href] || <LayoutDashboard className="w-5 h-5" />}
              <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{t(link.titleKey)}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('admin.copyright', { year: new Date().getFullYear() })}
        </div>
      </footer>
    </div>
  );
}
