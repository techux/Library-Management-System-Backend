# Library Management System _[Backend]_

**Live Link: [https://library-backend.koyeb.app/api/ping](https://library-backend.koyeb.app/api/ping)**

**Frontend Live Link: [https://library-devesh.vercel.app/](https://library-devesh.vercel.app/)**



Frontend here: [techux/Library-Management-System-Frontend](https://github.com/techux/Library-Management-System-Frontend)

This is a simple Library Management System developed using **Node.js**. It has two main perspectives: **Reader** and **Librarian**.

### Reader Perspective:
- **Borrow Books**: Readers can borrow books available in the library.
- **Return Books**: Readers can return borrowed books when they’re done.
- **Search Books**: Readers can search for books based on various criteria.
- **View Borrowed Books**: Readers can see a list of books they have borrowed and their borrowing history.
- **Account Deletion**: If desired, readers can delete their accounts from the system.

### Librarian Perspective:
- **Manage Books**: Librarians can add new books to the system, search for existing books, and delete books from the collection.
- **Manage Readers**: Librarians have the ability to view all registered readers, modify reader information, and add or delete readers from the system.

This system streamlines library operations by allowing both readers and librarians to perform essential tasks efficiently.

## Tech Used
- **Node.js**: Node.js is used as the primary runtime environment.
- **Express.js**: Express.js was used as the web framework to handle HTTP requests and responses.
- **MongoDB Atlas**: MongoDB was used as the database to store data.
- **Cloudinary**: to upload and host files on cloud


## Installation Steps
1. Clone the repository:
```bash
git clone https://github.com/techux/Library-Management-System-Backend
```

2. Navigate to the project directory:
```bash
cd Library-Management-System-Backend
```

3. Install dependencies:
```bash
npm install
```
4. Populate .env file:<br>
rename `sample.env` file into `.env` file and fill all the details <br>
_Go to [Cloudinary docs](https://cloudinary.com/documentation/finding_your_credentials_tutorial) to get cloudinary keys_

5. Start the development server:
```bash
npm run dev
```

6. Open your web browser and navigate to `http://localhost:8080` to access the server.

---

## DB Design Used
![image](https://github.com/user-attachments/assets/4ab5a5a2-9d76-457d-9ee6-f36c99e207bc)

<br>

**Alternate Approach**
![image](https://github.com/user-attachments/assets/7ce43e72-96a6-4349-9475-aaa98a88b5b5)


---

## API Documentation
### Authentication Routes
| Sr. No. | Method | Endpoint | Body | Description |
|:--:|:--:|--|--|--|
| 1 | POST | /api/auth/register | {name, email, username, password} | Register a new user |
| 2 | POST | /api/auth/login | {username or email, password} | Login to the application |
| 3 | POST | /api/auth/change-password | {newPassword, oldPassword} | Change Password|
| 4 | GET | /api/auth/check |  | Return the logged in user data |
| 5 | GET | /api/auth/logout |  | Logout the user |


### Public Routes
| Sr. No. | Method | Endpoint | Body | Description |
|:--:|:--:|--|--|--|
| 1 | GET | /api/books |  | Get all books |
| 2 | GET | /api/books/:slug |  | Get a book by slug |
| 3 | GET | /api/books/id/:id |  | Get a book by Book ID |
| 4 | GET | /api/books/search | query: q |Search book by keyword |


### Member Only Routes
| Sr. No. | Method | Endpoint | Body | Description |
|:--:|:--:|--|--|--|
| 1 | GET | /api/account/profile |  | View my profile |
| 2 | PATCH | /api/account/update | {name, username} | Update profile |
| 3 | DELETE | /api/account/ | | Delete my Account |
||
| 4 | GET | /api/account/borrowed |  | Get user borrowed Book |
| 5 | GET | /api/account/history |  | Get the previously borrowed book |
| 6 | GET | /api/account/return/:id |  | Return the book to library |
| 7 | GET | /api/account/borrow/:id |  | Borrow a new book from library to shelf |


### LIBRARIAN Only Routes
| Sr. No. | Method | Endpoint | Body | Description |
|:--:|:--:|--|--|--|
| 1 | POST | /api/admin/member | {name, username, email, password} | Add new user |
| 2 | GET | /api/admin/search | query: q | Search for user |
| 3 | GET | /api/admin/members | | View All Members
| 4 | GET | /api/admin/member/:id |  | View User details |
| 5 | PATCH | /api/admin/member/:id | {name, email, username, password} | Update user details |
| 6 | DELETE | /api/admin/member/:id |  | Delete user account |
||
| 7 | POST | /api/admin/book/ | {title, description, author, genre} | Add new Book |
| 8 | PATCH | /api/admin/book/:id | {title, description, author, genre} | Update book details |
| 9 | DELETE | /api/admin/book/:id |  | Delete Book |


# Devesh Singh
