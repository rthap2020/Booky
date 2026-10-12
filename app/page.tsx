'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch books on load
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });

      if (res.ok) {
        setTitle('');
        setAuthor('');
        fetchBooks();
      }
    } catch (err) {
      console.error('Failed to add book', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      const res = await fetch(`/api/books?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBooks();
      }
    } catch (err) {
      console.error('Failed to delete book', err);
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>Currently Reading</h1>
      <p>API Endpoint hosted at <code>/api/books</code></p>

      {/* Add Book Form */}
      <form onSubmit={addBook} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Add a New Book</h3>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <input
          type="text"
          placeholder="Author (Optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {/* Book List */}
      <h2>Reading List</h2>
      {books.length === 0 ? (
        <p>No books currently in the list.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {books.map((book) => (
            <li key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{book.title}</strong> <span style={{ color: '#666' }}>by {book.author}</span>
              </div>
              <button onClick={() => deleteBook(book.id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}