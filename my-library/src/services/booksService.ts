import { apiFetch } from "./http";

export type BookListDto = {
  id: number;
  title: string | null;
  authorId: number;
  authorName?: string | null;
  genreId: number;
  genreName?: string | null;
};
export type BookDetailsDto = BookListDto;

export type BookWrite = {
  title: string;
  authorId: number;
  genreId: number;
};

export const booksService = {
  getAll: () => apiFetch<BookListDto[]>("/api/Books"),
  getById: (id: number) => apiFetch<BookDetailsDto>(`/api/Books/${id}`),
  create: (data: BookWrite) =>
    apiFetch<BookDetailsDto>("/api/Books", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: BookWrite) =>
    apiFetch<void>(`/api/Books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<void>(`/api/Books/${id}`, { method: "DELETE" }),
};
