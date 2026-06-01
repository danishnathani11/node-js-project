# 📚 BookVault — Book Store Management System

A full-featured web-based Book Store Management System built with **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Multer**.

## ✨ Features

- **Add Books** — Title, Author, Category, Price, Quantity, Description, Cover Image
- **View All Books** — Grid layout with search, filter by category, sort by price/title
- **Book Detail Page** — Full info with inventory value, stock status
- **Edit Books** — Update any field, replace cover image
- **Delete Books** — Removes record and image from disk
- **Image Upload** — Multer middleware, 5MB limit, preview before save
- **Stats Dashboard** — Total books, inventory value
- **Responsive Design** — Mobile-friendly dark editorial theme

## 🚀 Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone / unzip the project
cd bookstore

# 2. Install dependencies
npm install

# 3. Start MongoDB (if local)
mongod

# 4. Run the app
npm start
# or for development with auto-reload:
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Environment Variables (optional)
Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
```

Then update `app.js` to use `process.env.MONGODB_URI`.

## 📁 Project Structure

```
bookstore/
├── app.js                  # Entry point
├── package.json
├── models/
│   └── Book.js             # Mongoose schema
├── routes/
│   └── books.js            # All CRUD routes + Multer
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── books/
│   │   ├── index.ejs       # All books list
│   │   ├── new.ejs         # Add book form
│   │   ├── show.ejs        # Book detail
│   │   └── edit.ejs        # Edit form
│   ├── 404.ejs
│   └── error.ejs
├── public/
│   ├── css/style.css
│   └── js/main.js
└── uploads/                # Auto-created for images
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| ejs | Template engine |
| multer | File/image uploads |
| method-override | PUT/DELETE via forms |

## 🗂️ Book Categories

Fiction, Non-Fiction, Science, Technology, Finance, History, Biography, Self-Help, Philosophy, Children, Mystery, Romance, Horror, Other

## 📋 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /books | List all books |
| GET | /books/new | Add book form |
| POST | /books | Create book |
| GET | /books/:id | Book detail |
| GET | /books/:id/edit | Edit form |
| PUT | /books/:id | Update book |
| DELETE | /books/:id | Delete book |
