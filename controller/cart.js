import Book from "../model/Book";
import User from "../model/User";

export const getCart = async (req, res) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('cart');
    res.status(200).json({status:"success",cart:user.cart,message:"Cart fetched successfully"});
}
export const addToCart = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        const { title, author, price, cover, category } = req.body;
        const newBook = new Book({ title, author, price, cover, category });
        await newBook.save();
        user.cart.push(newBook._id);
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
        const { bookId } = req.params;
        await Book.findByIdAndDelete(bookId);
        const bookIndex = user.cart.indexOf(bookId);
        if (bookIndex > -1) {
            user.cart.splice(bookIndex, 1);
        }
        await user.save();
        req.session.user = user;
        await req.session.save();
        res.status(200).json({ status: "success", message: "Book removed from cart successfully" });
    }catch(err){
        res.status(500).json({ status: "failure", message: err.message });
    }
}