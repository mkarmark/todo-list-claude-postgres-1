import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { completed } = await request.json();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Todo deleted successfully' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}