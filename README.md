# API Tarefas
 
A task management REST API built with Node.js, Express 5 and TypeScript, featuring API versioning, request validation, pagination and centralized error handling.
 
> *Tarefas* is Portuguese for "tasks". The API's field names and messages are in Portuguese.
 
## Features
 
- Full CRUD for tasks: create, list, get by id, update and delete
- **API versioning:** `/api/v1` and `/api/v2` run side by side
- **Deprecation signaling:** every v1 response carries `Deprecation` and `Sunset` headers, so clients know when to migrate
- **Pagination** in v2, with a `{ dados, meta: { pagina, limite, total } }` response
- Filter tasks by status (`?concluida=true`)
- Validation middleware for request bodies (required fields, types, empty strings)
- Request logging middleware (method, URL, status code and response time)
- Centralized 404 and error handling
## Tech stack
 
Node.js · TypeScript · Express 5 · tsx · Prettier
 
## Getting started
 
```bash
git clone https://github.com/Matkalil/api-tarefas.git
cd api-tarefas
npm install
cp .env.example .env
npm run dev
```
 
The API runs on `http://localhost:3000` by default (set `PORT` in `.env` to change it).
 
| Script | Description |
|---|---|
| `npm run dev` | Runs in watch mode from TypeScript |
| `npm run build` | Compiles to JavaScript in `dist/` |
| `npm start` | Runs the compiled build |
| `npm run typecheck` | Checks types without emitting files |
| `npm run format` | Formats the code with Prettier |
 
## Endpoints
 
### v1 (deprecated)
 
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/tarefas` | List tasks (optional filter `?concluida=true` or `false`) |
| GET | `/api/v1/tarefas/:id` | Get a task by id |
| POST | `/api/v1/tarefas` | Create a task |
| PATCH | `/api/v1/tarefas/:id` | Update a task's title and/or status |
| DELETE | `/api/v1/tarefas/:id` | Delete a task |
 
### v2
 
| Method | Route | Description |
|---|---|---|
| GET | `/api/v2/tarefas?pagina=1&limite=10` | Paginated list of tasks |
 
## Examples
 
Create a task:
 
```bash
curl -X POST http://localhost:3000/api/v1/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Study Express"}'
```
 
```json
{ "id": 2, "titulo": "Study Express", "concluida": false }
```
 
Paginated list (v2):
 
```bash
curl "http://localhost:3000/api/v2/tarefas?pagina=1&limite=5"
```
 
```json
{
  "dados": [{ "id": 1, "titulo": "...", "concluida": false }],
  "meta": { "pagina": 1, "limite": 5, "total": 1 }
}
```
 
## Validation and errors
 
| Situation | Status | Response |
|---|---|---|
| `POST` without `titulo` | 400 | `{ "erro": "titulo é obrigatório" }` |
| `titulo` empty or not a string | 400 | `{ "erro": "titulo deve ser um texto não vazio" }` |
| `concluida` not a boolean | 400 | `{ "erro": "concluida deve ser booleano" }` |
| Task not found | 404 | `{ "erro": "Tarefa não encontrada" }` |
| Unknown route | 404 | `{ "erro": "Rota não encontrada" }` |
| Unexpected error | 500 | `{ "erro": "Erro interno do servidor" }` |
 
## Project structure
 
```
src/
├── app.ts               # Express app, middlewares and route versions
├── server.ts            # HTTP server
├── controllers/v1, v2   # Request handlers per API version
├── routes/v1, v2        # Routers per API version
├── middlewares/         # Logger, validation and error handling
├── data/                # In-memory data
└── types/               # TypeScript types
```
 
Data is kept in memory, so it resets every time the server restarts.
 
## Author
 
Mateus Kuhnen Kalil · [GitHub](https://github.com/Matkalil) · [LinkedIn](https://www.linkedin.com/in/mateus-k-kalil-589392418/)
 
Built during SENAI's Carreira Tech back-end program.
 
