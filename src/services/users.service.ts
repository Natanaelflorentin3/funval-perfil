import api from "../api/axios";
import type { UserResponse } from "../types/user";

export async function getUsersService(): Promise<UserResponse[]> {
  const res = await api.get<UserResponse[]>("/users/");
  return res.data;
}
