import { NextResponse } from 'next/server';

// Temporary in-memory storage (replace with your external API/database later)
let books = [
  { id: '1', title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas' },
  { id: '2', title: 'Design Patterns', author: 'Erich Gamma et al.' }
];

// GET: Returns the list of books
export async function GET() {
  return NextResponse.json(books);
}

// POST: Adds a new book
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Book title is required' }, { status: 400 });
    }

    const newBook = {
      id: Date.now().toString(),
      title: body.title,
      author: body.author || 'Unknown Author'
    };

    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE: Removes a book by id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const initialLength = books.length;
    books = books.filter(book => book.id !== id);

    if (books.length === initialLength) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}