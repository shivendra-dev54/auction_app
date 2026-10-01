"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/authStore";
import { axiosRequestHandler } from "@/utils/axiosRequestHandler";

const navLinks = [
  { href: "/app/main", label: "Overview" },
  { href: "/app/items", label: "Inventory" },
  { href: "/app/auction", label: "Auctions" },
];

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosRequestHandler("/api/auth/logout", "POST", null, logout);
    } catch {
      // Local sign-out should still work when the API is unreachable.
    } finally {
      logout();
      router.push("/");
    }
  };

  return <header className="site-header">
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="brand-mark" href={user ? "/app/main" : "/"} aria-label="Lotline home">
        <span className="brand-icon" aria-hidden="true">L</span><span>LOTLINE</span>
      </Link>
      {mounted && user ? <>
        <div className="nav-links">
          {navLinks.map((link) => <Link className={pathname.startsWith(link.href) ? "nav-link nav-link-active" : "nav-link"} href={link.href} key={link.href}>{link.label}</Link>)}
        </div>
        <div className="account-menu-wrap">
          <button className="account-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span className="account-avatar">{user.username.slice(0, 1).toUpperCase()}</span><span className="account-name">{user.username}</span><span className="account-chevron" aria-hidden="true">⌄</span>
          </button>
          {menuOpen && <>
            <button className="menu-dismiss" aria-label="Close account menu" onClick={() => setMenuOpen(false)} />
            <div className="account-dropdown"><strong>@{user.username}</strong><span>{user.email}</span><button onClick={handleLogout}>Sign out</button></div>
          </>}
        </div>
      </> : mounted && pathname !== "/auth" ? <Link className="nav-signin" href="/auth">Sign in <span aria-hidden="true">→</span></Link> : <span className="nav-spacer" />}
    </nav>
  </header>;
};