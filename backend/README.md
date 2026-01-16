# Academic A+ Plus - Backend API

FastAPI backend for generating exam questions with AI-powered solutions.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

.\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Health Check: http://localhost:8000/health
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### POST /generate
Generate exam questions based on course, chapter, and difficulty.

**Request Body:**
```json
{
  "course": "CSE 260",
  "chapter": "Boolean Algebra",
  "examType": "quiz",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "course": "CSE 260",
  "chapter": "Boolean Algebra",
  "examType": "quiz",
  "items": [
    {
      "question": "...",
      "marks": 10,
      "difficulty": "medium",
      "solution": "...",
      "common_mistakes": ["..."]
    }
  ]
}
```

## Development

The current implementation uses dummy data. Future enhancements will include:
- Integration with AI/LLM for question generation
- RAG (Retrieval-Augmented Generation) for context-aware questions
- Database for storing questions and user progress
- Authentication and user management

## License

MIT
