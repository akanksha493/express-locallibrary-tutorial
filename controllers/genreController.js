const {body, validationResult} = require("express-validator");
const Genre = require("../models/genre");
const Book = require("../models/book");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");


exports.genre_list = asyncHandler(async (req,res,next)=>{
    // res.send("NOT IMPLEMENTED: Genre list");
    const allGenres = await Genre.find().sort({name:1}).exec();
    res.render("genre_list", {
        title: "Genre List",
        genre_list: allGenres,
    });
});
exports.genre_detail = asyncHandler(async (req,res, next) =>{
    // res.send(`NOT IMPLEMETED: Genre detail: ${req.params.id}`);
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec(),
    ]);
    if(genre===null){
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    res.render("genre_detail", {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre,
    });
    
});

exports.genre_create_get = (req,res,next) => {
    // res.send("NOT IMPLEMENTED: Genre create GET");
    res.render("genre_form", {title: "Create Genre"});
};
exports.genre_create_post = [
    // res.send("NOT IMPLEMENTED: Genre create POST");
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({min:3})
        .escape(),
    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req);
        const genre = new Genre({name: req.body.name});
        if(!errors.isEmpty()){
            //errors exist
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return ;
        }else{
            const genreExists = await Genre.findOne({name: req.body.name})
                .collation({locale: "en", strength:2})
                .exec();
            if(genreExists){
                res.redirect(genreExists.url);
            }else{
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];

exports.genre_delete_get = asyncHandler(async (req,res,next) => {
    // res.send("NOT IMPLEMENTED: Genre delete GET");
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec(),
    ]);
    if(genre===null){
        res.redirect("/catalog/genres");
    }
    res.render("genre_delete",{
        title: "Delete Genre",
        genre: genre,
        genre_books: booksInGenre,
    });
});
exports.genre_delete_post = asyncHandler(async (req,res,next) => {
    // res.send("NOT IMPLEMENTED: Genre delete POST");
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec(),
    ]);
    if(booksInGenre.length>0){
        res.render("genre_delete", {
            title: "Delete Genre",
            genre:genre,
            genre_books: booksInGenre,
        });
        return;
    }else{
        await Genre.findByIdAndDelete(req.body.genreid);
        res.redirect("/catalog/genres");
    }
});

exports.genre_update_get = asyncHandler(async (req,res,next) => {
    // res.send("NOT IMPLEMENTED: Genre update GET");
    const genre = await Genre.findById(req.params.id).exec();
    if(genre===null){
        const err = new Error("Genre not found.");
        err.status = 404;
        return next(err);
    }
    res.render("genre_form", {
        title: "Update Genre", 
        genre: genre,
    });
});
exports.genre_update_post = [
    // res.send("NOT IMPLEMENTED: Genre update POST");
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({min:3})
        .escape(),
    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req);
        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id,
        });
        if(!errors.isEmpty()){
            //errors exist
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return ;
        }else{
            const genreExists = await Genre.findOne({name: req.body.name})
                .collation({locale: "en", strength:2})
                .exec();
            if(genreExists){
                res.redirect(genreExists.url);
            }else{
                const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
                res.redirect(updatedGenre.url);
            }
        }
    }),
];