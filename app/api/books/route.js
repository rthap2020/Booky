import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
const filePath = isVercel 
  ? '/tmp/books.json' 
  : path.join(process.cwd(), 'books.json');

async function getBooks() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    const defaultBooks = [
      { id: '1', title: 'A Clash of Kings', author: 'George R.R. Martin' },
      { id: '2', title: 'Design Patterns', author: 'Erich Gamma et al.' }
    ];
    await fs.writeFile(filePath, JSON.stringify(defaultBooks, null, 2));
    return defaultBooks;
  }
}

async function saveBooks(books) {
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read books' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Book title is required' }, { status: 400, headers: corsHeaders() });
    }

    const books = await getBooks();
    const newBook = {
      id: Date.now().toString(),
      title: body.title,
      author: body.author || 'Unknown Author'
    };

    books.push(newBook);
    await saveBooks(books);
    return NextResponse.json(newBook, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: corsHeaders() });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400, headers: corsHeaders() });
    }

    let books = await getBooks();
    const initialLength = books.length;
    books = books.filter(book => book.id !== id);

    if (books.length === initialLength) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404, headers: corsHeaders() });
    }

    await saveBooks(books);
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500, headers: corsHeaders() });
  }
}