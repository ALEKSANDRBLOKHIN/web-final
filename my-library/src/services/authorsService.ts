import { apiFetch } from "./http";

export type Author = {
  id?: number;
  name: string;
};

export const authorsService = {
  getAll: () => apiFetch<Author[]>("/api/Authors"),

  getById: (id: number) => apiFetch<Author>(`/api/Authors/${id}`),

  create: (data: Omit<Author, "id">) =>
    apiFetch<Author>("/api/Authors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Omit<Author, "id">) =>
    apiFetch<Author>(`/api/Authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: number) =>
    apiFetch<void>(`/api/Authors/${id}`, {
      method: "DELETE",
    }),
};
