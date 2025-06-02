export type Role = 'User' | 'Reviewer' | 'Admin' | null;

export type Setting = {
  name: string;
  path: string;
  roles: Role[];
};

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