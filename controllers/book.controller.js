const Book = require("../models/book.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");
var slugify = require('slugify')
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';


const allBookController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find({}).skip(skip).limit(limit);

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        return res.status(200).json({
            status: "ok",
            data: {
                books,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBooks,
                    limit
                }
            }
        });

    } catch (error) {
        console.error(`Error in allBookController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};



// get book by slug
const getBookBySlugController = async (req, res) => {
    try {
        const slug = req.params.slug; 
        if (!slug) {
            return res.status(400).json({
                status: "error",
                message: "Slug is required"
            })
        }
        const book = await Book.findOne({ slug });
        if (!book) {
            return res.status(404).json({
                status: "error",
                message: "Book not found"
            })
        }
        return res.status(200).json({
            status: "ok",
            data: book
        })
    } catch (error) {
        console.error(`Error in getBookBySlugController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// search books
const searchBookController = async (req, res) => {
    try {
        const keyword = req.query.q ;
        if (!keyword) {
            return res.status(400).json({
                status: "error",
                message: "Search keyword is required"
            })
        }
        const books = await Book.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } },
                { genre: { $regex: keyword, $options: 'i' } },
                { slug: { $regex: keyword, $options: 'i' } },
            ]
        });
        
        return res.status(200).json({
            status: "ok",
            data: books
        });
        
    } catch (error) {
        console.error(`Error in searchBookController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// add a new book 
const addBookController = async (req, res) => {
    try {
        const {title, description, author, genre} = req.body ;
        if (!title || !description || !author || !genre){
            return res.status(400).json({
                status: "error",
                message: "Please fill in all the fields"
            })
        }

        const slug = slugify(title.toLowerCase(),{strict:true}) +"-"+ customAlphabet(alphabet, 10)() ;

        const book = await Book.create({
            title,
            description,
            slug,
            author,
            genre,
        })

        return res.status(201).json({
            status: "ok",
            message: "Book Added Successfully",
            data: book
        })
    } catch (error) {
        console.error(`Error in addBookController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// edit book details
const updateBookController = async (req, res) => {
    try {
        const bookId = req.params.id ;
        const {title, description, author, genre} = req.body ;

        if (!bookId) {
            return res.status(400).json({
                status: "error",
                message: "Please select a book to edit details"
            })
        }

        if (!title && !description && !author && !genre) {
            return res.status(400).json({
                status: "error",
                message: "Please make some changes to update"
            })
        }

        let updateQuery = {}
        if (title) updateQuery.title = title ;
        if (description) updateQuery.description = description ;
        if (author) updateQuery.author = author ;
        if (genre) updateQuery.genre = genre ;

        const book = await Book.findByIdAndUpdate(
            bookId,
            {
                $set: updateQuery
            },
            {
                new: true
            }
        )
        return res.status(200).json({
            status: "ok",
            message: "Book details updated Successfully",
            data: book
        })
    } catch (error) {
        console.error(`Error in updateBookController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// delete book
const deleteBookController = async (req, res) => {
    try {
        const id = req.params.id ;
        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "Id is required"
            })
        }
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({
                status: "error",
                message: "Book not found"
            })
        }
        return res.status(200).json({
            status: "ok",
            message: "Book deleted Successfully"
        })
    } catch (error) {
        console.error(`Error in deleteBookController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// add book to user's bookself || borrow book by user
const borrowBookController = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!bookId){
            return res.status(400).json({
                status: "error",
                message: "Please select a book to borrow"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).json({
                status: "error",
                message: "Invalid Book ID passed"
            })
        }
        // check if book is already there in user book shelf
        const isBookAlreadyBorrowed = await User.findOne({
            _id: req.user.id,
            mybooks: bookId
        })
        if (isBookAlreadyBorrowed){
            return res.status(400).json({
                status: "error",
                message: "Book is already in your Shelf"
            })
        }

        // book is not in the shelf, so add it
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: {
                    mybooks: bookId
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json({
            status: "ok",
            message: "Book added on your book shelf",
            // data: addBook
        })

    } catch (error) {
        console.error(`Error in borrowBookController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// return book by user || remove|delete from user bookself
const removeBookFromShelfController = async (req, res) => {
    try {
        const bookId = req.params.id;
      
        if (!bookId){
            return res.status(200).json({
                status: "error",
                message: "Please select a book to remove it from Shelf"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(bookId)){
            return res.status(400).json({
                status: "error",
                message: "Invalid book id is passed"
            })
        }
        // remoe book from myBooks and add it to bookHistory
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $pull: {
                    mybooks: bookId
                },
                $push: {
                    bookHistory: bookId
                }
            }
        );        

        return res.status(200).json({
            status: "ok",
            message: "Book removed from Shelf"
        })
    } catch (error) {
        console.error(`Error in removeBookFromShelfController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


// get all books of user || get all borrowed books of user || /mybooks
const myBookController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.user.id).select("mybooks")
            .populate({
                path: "mybooks",
                options: {
                    skip: skip,
                    limit: limit
                }
            });

        const totalBooks = user.mybooks.length;
        const totalPages = Math.ceil(totalBooks / limit);

        return res.status(200).json({
            status: "ok",
            data: {
                mybooks: user.mybooks,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBooks,
                    limit
                }
            }
        });
    } catch (error) {
        console.error(`Error in myBookController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};



// get all returned books of user || like borrowed history || /history || adv
const myHistoryController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.user.id).select("bookHistory").
        populate({
            path: "bookHistory",
            options: {
                skip: skip,
                limit: limit
            }
        });
        // populate("bookHistory");

        const totalBooks = user.bookHistory.length;
        const totalPages = Math.ceil(totalBooks / limit);

        return res.status(200).json({
            status: "ok",
            data: {
                book: user.bookHistory,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBooks,
                    limit
                }
            }
        })
    } catch (error) {
        console.error(`Error in myHistoryController: ${error.stack || error.message}`)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    allBookController,
    getBookBySlugController,
    searchBookController,
    addBookController,
    updateBookController,
    deleteBookController,
    borrowBookController,
    removeBookFromShelfController,
    myBookController,
    myHistoryController
}