import { useEffect, useState } from "react";
import { authorsService, type Author } from "./services/authorsService";
import { genresService, type Genre } from "./services/genresService";
import { booksService, type BookListDto, type BookWrite } from "./services/booksService";

type Tab = "authors" | "books" | "genres";

export default function App() {
  const [tab, setTab] = useState<Tab>("authors");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      <Header tab={tab} onChange={setTab} />
      {tab === "authors" && <AuthorsView />}
      {tab === "books" && <BooksView />}
      {tab === "genres" && <GenresView />}
    </div>
  );
}

function Header({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const Button = ({ t, label }: { t: Tab; label: string }) => (
    <button
      onClick={() => onChange(t)}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: tab === t ? "#6d28d9" : "white",
        color: tab === t ? "white" : "#111827",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      <Button t="authors" label="Authors" />
      <Button t="books" label="Books" />
      <Button t="genres" label="Genres" />
    </div>
  );
}

function AuthorsView() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    try { setLoading(true); setError(""); setAuthors(await authorsService.getAll()); }
    catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const addAuthor = async () => {
    if (!newName.trim()) return;
    try { await authorsService.create({ name: newName.trim() }); setNewName(""); await load(); }
    catch (e) { setError(String(e)); }
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    try { await authorsService.update(editingId, { name: editingName.trim() || "Unnamed" }); setEditingId(null); setEditingName(""); await load(); }
    catch (e) { setError(String(e)); }
  };

  const remove = async (id?: number) => {
    if (!id || !confirm("Delete author?")) return;
    try { await authorsService.remove(id); await load(); }
    catch (e) { setError(String(e)); }
  };

  if (error) return errorBox(error);
  return (
    <Card title="Authors">
      <Row>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New author name" style={input}/>
        <button onClick={addAuthor} style={btn}>Add</button>
      </Row>

      {loading ? <p>Loading...</p> : authors.length === 0 ? <Muted>No authors yet.</Muted> : (
        <ul style={{ display: "grid", gap: 8 }}>
          {authors.map(a => (
            <li key={a.id} style={item}>
              {a.id === editingId ? (
                <>
                  <input value={editingName} onChange={(e)=>setEditingName(e.target.value)} style={input}/>
                  <button onClick={saveEdit} style={btn}>Save</button>
                  <button onClick={()=>{setEditingId(null); setEditingName("");}} style={ghost}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={{flex:1}}><strong>#{a.id}</strong> — {a.name}</div>
                  <button onClick={()=>{setEditingId(a.id!); setEditingName(a.name);}} style={btn}>Edit</button>
                  <button onClick={()=>remove(a.id)} style={danger}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function GenresView() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    try { setLoading(true); setError(""); setGenres(await genresService.getAll()); }
    catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const addGenre = async () => {
    if (!newName.trim()) return;
    try { await genresService.create({ name: newName.trim() }); setNewName(""); await load(); }
    catch (e) { setError(String(e)); }
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    try { await genresService.update(editingId, { name: editingName.trim() || "Unnamed" }); setEditingId(null); setEditingName(""); await load(); }
    catch (e) { setError(String(e)); }
  };

  const remove = async (id?: number) => {
    if (!id || !confirm("Delete genre?")) return;
    try { await genresService.remove(id); await load(); }
    catch (e) { setError(String(e)); }
  };

  if (error) return errorBox(error);
  return (
    <Card title="Genres">
      <Row>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New genre name" style={input}/>
        <button onClick={addGenre} style={btn}>Add</button>
      </Row>

      {loading ? <p>Loading...</p> : genres.length === 0 ? <Muted>No genres yet.</Muted> : (
        <ul style={{ display: "grid", gap: 8 }}>
          {genres.map(g => (
            <li key={g.id} style={item}>
              {g.id === editingId ? (
                <>
                  <input value={editingName} onChange={(e)=>setEditingName(e.target.value)} style={input}/>
                  <button onClick={saveEdit} style={btn}>Save</button>
                  <button onClick={()=>{setEditingId(null); setEditingName("");}} style={ghost}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={{flex:1}}><strong>#{g.id}</strong> — {g.name}</div>
                  <button onClick={()=>{setEditingId(g.id!); setEditingName(g.name);}} style={btn}>Edit</button>
                  <button onClick={()=>remove(g.id)} style={danger}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

import { searchBooksByTitle, type BookSuggestion } from "./services/googleBooksService";

function BooksView() {
  const [books, setBooks] = useState<BookListDto[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState<number>(0);
  const [genreId, setGenreId] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  let debounceTimer: number | undefined;

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [b, a, g] = await Promise.all([
        booksService.getAll(),
        authorsService.getAll(),
        genresService.getAll(),
      ]);
      setBooks(b); setAuthors(a); setGenres(g);
      if (g[0]) setGenreId(g[0].id!);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const norm = (s: string) =>
    s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

  const onTitleChange = (v: string) => {
    setTitle(v);
    setShowSuggest(true);
    if (debounceTimer) window.clearTimeout(debounceTimer);
    if (v.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceTimer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await searchBooksByTitle(v);
        setSuggestions(res);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const chooseSuggestion = (s: BookSuggestion) => {
    setTitle(s.title);
    if (s.author) {
      const names = s.author.split(/,|&| and /i).map(x => x.trim()).filter(Boolean);
      const found = authors.find(a => names.some(n => norm(a.name) === norm(n)));
      if (found?.id) setAuthorId(found.id);
      else setAuthorId(0);
    }
    setShowSuggest(false);
  };

  const clearForm = () => {
    setTitle("");
    setAuthorId(0);
    setGenreId(genres[0]?.id ?? 0);
    setEditingId(null);
    setSuggestions([]);
    setShowSuggest(false);
  };

  const submit = async () => {
    if (!title.trim() || !authorId || !genreId) {
      alert("Fill in Title, Author, and Genre");
      return;
    }
    const payload: BookWrite = { title: title.trim(), authorId, genreId };
    try {
      if (editingId == null) await booksService.create(payload);
      else await booksService.update(editingId, payload);
      clearForm();
      await load();
    } catch (e) {
      setError(String(e));
    }
  };

  const startEdit = (b: BookListDto) => {
    setEditingId(b.id);
    setTitle(b.title || "");
    setAuthorId(b.authorId);
    setGenreId(b.genreId);
    setSuggestions([]);
    setShowSuggest(false);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete book?")) return;
    try { await booksService.remove(id); await load(); }
    catch (e) { setError(String(e)); }
  };

  if (error) return errorBox(error);

  return (
    <Card title="Books">
      <div style={{ position: "relative" }}>
        <Row>
          <input
            value={title}
            onChange={(e)=>onTitleChange(e.target.value)}
            onFocus={()=>setShowSuggest(true)}
            placeholder="Book title"
            style={input}
          />

          <select value={authorId} onChange={e=>setAuthorId(Number(e.target.value))} style={input}>
            <option value={0}>Select author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <select value={genreId} onChange={e=>setGenreId(Number(e.target.value))} style={input}>
            <option value={0}>Select genre</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <button onClick={submit} style={btn}>
            {editingId == null ? "Add" : "Save"}
          </button>
          {editingId != null && (
            <button onClick={clearForm} style={ghost}>Cancel</button>
          )}
        </Row>

        {showSuggest && suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              right: 0,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "white",
              maxHeight: 300,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {suggestions.map(s => (
              <div
                key={s.id}
                onClick={() => chooseSuggestion(s)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  display: "flex",
                  gap: 10,
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                {s.thumbnail && (
                  <img
                    src={s.thumbnail}
                    width={32}
                    height={44}
                    style={{ borderRadius: 4 }}
                    onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display = "none"}}
                  />
                )}
                <div>
                  <strong>{s.title}</strong>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {s.author || "Unknown"}
                    {s.publishedDate ? ` • ${s.publishedDate}` : ""}
                    {s.isbn ? ` • ISBN ${s.isbn}` : " • No ISBN"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {authorId === 0 && title.trim() !== "" && (
        <>
          <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>
            Author not found. Choose manually or create a new author.
          </div>
          <button
            onClick={() => {
              const autoName = suggestions[0]?.author?.split(",")[0]?.trim() || "Unknown";
              if (!confirm(`Create author "${autoName}"?`)) return;
              authorsService.create({ name: autoName }).then(() => load());
            }}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#111827",
              color: "white",
              fontSize: 12,
              marginTop: 6,
            }}
          >
            ➕ Create author from Google
          </button>
        </>
      )}

      {loading ? <p>Loading...</p> : books.length === 0 ? (
        <Muted>No books yet.</Muted>
      ) : (
        <ul style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {books.map(b => (
            <li key={b.id} style={item}>
              <div style={{flex:1}}>
                <strong>#{b.id}</strong> — {b.title} · {b.authorName ?? `author#${b.authorId}`} · {b.genreName ?? `genre#${b.genreId}`}
              </div>
              <button onClick={()=>startEdit(b)} style={btn}>Edit</button>
              <button onClick={()=>remove(b.id)} style={danger}>Delete</button>
            </li> ))}
        </ul>
      )}
    </Card>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{children}</div>;
}
function Muted({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#6b7280" }}>{children}</p>;
}
function errorBox(error: string) {
  return (
    <div style={{ padding: 16, color: "#b91c1c" }}>
      Error. Please try again later.
      <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 12 }}>{error}</div>
    </div>
  );
}

const input: React.CSSProperties = { flex: 1, minWidth: 140, padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8 };
const item:  React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 };
const btn:   React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#111827", color: "white", fontWeight: 600 };
const ghost: React.CSSProperties = { ...btn, background: "white", color: "#111827" };
const danger:React.CSSProperties = { ...btn, background: "#b91c1c" };
