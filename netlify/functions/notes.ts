import { Handler } from '@netlify/functions';

let notes = [];

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  const { httpMethod, body } = event;

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    switch (httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(notes)
        };

      case 'POST':
        const newNote = JSON.parse(body);
        notes.push(newNote);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newNote)
        };

      case 'PUT':
        const updatedNote = JSON.parse(body);
        notes = notes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedNote)
        };

      case 'DELETE':
        const { id } = JSON.parse(body);
        notes = notes.filter(note => note.id !== id);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ id })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};