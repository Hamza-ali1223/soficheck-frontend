import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-sky-50/80 via-white to-cyan-50/60 dark:from-default-50 dark:via-background dark:to-default-100/30">
      {/* Navbar */}
      <HeroUINavbar maxWidth="xl" position="sticky" isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="gap-2">
            <Link className="flex items-center gap-2" color="foreground" href="/">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 shadow-sm">
                <span className="text-sm font-bold text-white">SC</span>
              </div>
              <span className="font-bold text-inherit text-lg">
                SOFI Check
              </span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Main */}
      <main className="container mx-auto max-w-4xl flex-grow px-4 sm:px-6 pt-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center py-4 mt-8">
        <p className="text-xs text-default-400">
          SOFI Check &middot; Built with{" "}
          <Link
            isExternal
            className="text-xs text-default-500 hover:text-primary"
            href="https://heroui.com"
          >
            HeroUI
          </Link>
        </p>
      </footer>
    </div>
  );
}
