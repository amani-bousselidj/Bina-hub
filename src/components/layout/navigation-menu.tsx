import * as React from "react";
import { cn } from "@/lib/utils";

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {}

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
    </nav>
  )
);
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      {...props}
    >
      {children}
    </ul>
  )
);
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props}>
      {children}
    </li>
  )
);
NavigationMenuItem.displayName = "NavigationMenuItem";

export { NavigationMenu, NavigationMenuList, NavigationMenuItem };


