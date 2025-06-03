import axios from "axios";
import { MenuItemData } from './Types';

const API_URL = 'http://localhost:5099/api/menuitems';

export async function GetMenuItems(role?: string): Promise<MenuItemData[]> {
  try {
    const response = await axios.get<MenuItemData[]>(API_URL, {
      params: role ? { role } : {}
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    throw error;
  }
}
