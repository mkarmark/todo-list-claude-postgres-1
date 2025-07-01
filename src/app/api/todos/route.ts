import { NextRequest, NextResponse } from 'next/server';
import pool, { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM todos ORDER BY created_at DESC');
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    await initializeDatabase();
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING *',
        [text.trim()]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}