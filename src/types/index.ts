import { type z } from "zod";

// import type {
//   cartItemSchema,
//   checkoutItemSchema,
// } from "@/lib/validations/cart";
import { type Icons } from "@/components/icons";
import { type SourceProps } from "@/server/db";
// import type { Icon } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

// export type SidebarNavItem = {
//   title: string;
//   disabled?: boolean;
//   external?: boolean;
//   icon?: keyof typeof Icons;
// } & (
//   | {
//       href: string;
//       items?: never;
//     }
//   | {
//       href?: string;
//       items: NavLink[];
//     }
// );

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type NavItemNavItem = NavItemWithChildren;

export type UserRole = "user" | "admin" | "superadmin";

export type Option = {
  label: string;
  value: string;
};

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export type GigTab = "upcoming" | "recentlyCreated" | "all" | "createNew";

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  name?: string;
}

export type SantaProps = Pick<SourceProps, "id" | "role">;
export type MrsSantaProps = Pick<SourceProps, "id" | "nameFirst">;
