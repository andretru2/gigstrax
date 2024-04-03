// import type {
//   cartItemSchema,
//   checkoutItemSchema,
// } from "@/lib/validations/cart";
import { type Icons } from "@/components/icons";
import { type SourceProps, type ClientProps, type GigProps } from "@/server/db";
import { type Prisma } from "@prisma/client";
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

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}
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

export type Tab = "recentlyCreated" | "all" | "createNew";
export type GigTab = Tab | "upcoming" | "past" | "all";

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  name?: string;
}

export type SantaProps = Pick<SourceProps, "id" | "role">;
export type SourcePickerProps = Pick<
  SourceProps,
  "id" | "role" | "nameFirst" | "nameLast"
>;
export type ClientPickerProps = Pick<ClientProps, "id" | "client">;
export type SantaType = "RBS" | "Mrs. Claus";

export type GigExtendedProps = Partial<GigProps> & {
  client?: Partial<ClientProps>;
  santa?: SantaProps;
  mrsSanta?: SantaProps;
};

export type GetGigsProps = {
  select?: Prisma.GigSelect;
  whereClause?: Prisma.GigWhereInput;
  orderBy?: Prisma.GigOrderByWithRelationInput[];
  limit?: Prisma.GigFindManyArgs["take"];
  skip?: Prisma.GigFindManyArgs["skip"];
  distinct?: Prisma.GigScalarFieldEnum[];
};

export type GetClientsProps = {
  select?: Prisma.ClientSelect;
  whereClause?: Prisma.ClientWhereInput;
  orderBy?: Prisma.ClientOrderByWithRelationInput[];
  limit?: Prisma.ClientFindManyArgs["take"];
  skip?: Prisma.ClientFindManyArgs["skip"];
};

export type GetSourcesProps = {
  select?: Prisma.SourceSelect;
  whereClause?: Prisma.SourceWhereInput;
  orderBy?: Prisma.SourceOrderByWithRelationInput[];
  limit?: Prisma.SourceFindManyArgs["take"];
  skip?: Prisma.SourceFindManyArgs["skip"];
};
