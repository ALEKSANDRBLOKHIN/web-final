
export type BookSuggestion = {
  id: string;
  title: string;
  author?: string;
  publishedDate?: string;    
  isbn?: string;
  thumbnail?: string;
  description?: string;
};

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";


function transformGoogleBook(item: any): BookSuggestion {
  const v = item.volumeInfo ?? {};
  const ids: Array<{ type: string; identifier: string }> = v.industryIdentifiers ?? [];
  const isbn13 = ids.find(x => x.type === "ISBN_13")?.identifier
              ?? ids.find(x => x.type === "ISBN_10")?.identifier;

  return {
    id: item.id,
    title: v.title ?? "Untitled",
    author: Array.isArray(v.authors) ? v.authors.join(", ") : v.authors,
    publishedDate: v.publishedDate,
    isbn: isbn13,
    thumbnail: v.imageLinks?.thumbnail,
    description: v.description,
  };
}


export async function searchBooksByTitle(title: string): Promise<BookSuggestion[]> {
  if (!title || title.trim().length < 3) return [];
  const params = new URLSearchParams({
    q: `intitle:${title.trim()}`,
    country: "US",
    maxResults: "40",
  });
  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
  if (!res.ok) throw new Error(`Google API ${res.status} ${res.statusText}`);
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map(transformGoogleBook);
}
