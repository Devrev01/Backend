import Book from "../model/Book.js";
import User from "../model/User.js";

export const getCart = async (req, res) => {
    try{
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('cart');
        res.status(200).json({status:"success",cart:user.cart,message:"Cart fetched successfully"});
    }catch(err){
        res.status(500).json({ status: "failure", message: err.message });
    }
}
export const addToCart = async (req, res) => {
    try {
        console.log(req.session)
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        const { title, author, price, cover, category,book_id } = req.body;
        const newBook = new Book({ title, author, price, cover, category, bookId: book_id });
        await newBook.save();
        user.cart.push(newBook._id);
        user.booksId.push(book_id);
        await user.save();
        req.session.user = user;
        await req.session.save();
        res.status(200).json({ status: "success", message: "Book added to cart successfully" });
    } catch (err) {
        res.status(500).json({ status: "failure", message: err.message });
    }
}
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        const { bookId,book_id } = req.params;
        await Book.findByIdAndDelete(bookId);
        const cartIndex = user.cart.indexOf(bookId);
        const bookIndex = user.booksId.indexOf(book_id);
        if (cartIndex > -1) {
            user.cart.splice(cartIndex, 1);
        }
        if(bookIndex > -1){
            user.booksId.splice(bookIndex,1);
        }
        await user.save();
        req.session.user = user;
        await req.session.save();
        res.status(200).json({ status: "success", message: "Book removed from cart successfully" });
    }catch(err){
        res.status(500).json({ status: "failure", message: err.message });
    }
}