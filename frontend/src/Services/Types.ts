export type Role = 'User' | 'Reviewer' | 'Admin' | null;

export interface RomanianIdRecord {
  id: number;
  nume?: string;
  prenume?: string;
  cnp?: string;
  cetatenie?: string;
  sex?: string;
  dataNasterii?: string;
  validitate?: string;
  domiciliu?: string;
  serie?: string;
  numar?: string;
  locNastere?: string;
}

export enum MenuType {
  setting,
  page
}

export interface MenuItemData {
  id: number;
  name: string;
  path: string;
  roles: string;
  type: MenuType;
}

export type Theme = "system" | "light" | "dark";

export interface UserSetting {
  profilePictureUrl: string | null;
  theme: Theme;
}