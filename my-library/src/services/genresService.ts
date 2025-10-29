import { apiFetch } from "./http";

export type Genre = { id?: number; name: string };

export const genresService = {
  getAll: () => apiFetch<Genre[]>("/api/Genres"),
  getById: (id: number) => apiFetch<Genre>(`/api/Genres/${id}`),
  create: (data: Omit<Genre, "id">) =>
    apiFetch<Genre>("/api/Genres", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Omit<Genre, "id">) =>
    apiFetch<Genre>(`/api/Genres/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<void>(`/api/Genres/${id}`, { method: "DELETE" }),
};
