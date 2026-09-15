import { useEffect, useState } from "react";
import "./books.css";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

// Demo book catalog used to keep the library browsing section full and consistent
// even when the backend is not connected or no database data is available.
const demoBooks = [
  {
    _id: "book-1",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 299,
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    description: "A practical guide to writing readable, maintainable, and efficient code.",
  },
  {
    _id: "book-2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    price: 349,
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    description: "A classic book focused on practical software development and professional habits.",
  },
  {
    _id: "book-3",
    title: "Data Structures and Algorithms",
    author: "Mark Allen Weiss",
    category: "Computer Science",
    price: 399,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    description: "A deep introduction to core data structures and algorithmic problem-solving.",
  },
  {
    _id: "book-4",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    price: 259,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    description: "A focused guide to building strong habits through small, consistent actions.",
  },
  {
    _id: "book-5",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: 230,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    description: "A timeless philosophical novel about destiny, dreams, and personal growth.",
  },
  {
    _id: "book-6",
    title: "English Grammar Essentials",
    author: "M. L. Sharma",
    category: "English",
    price: 210,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    description: "A clear, practical guide for mastering grammar and writing skills.",
  },
  {
    _id: "book-7",
    title: "Physics for Beginners",
    author: "Amit Verma",
    category: "Science",
    price: 320,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    description: "A simple and engaging book to understand core concepts of physics.",
  },
  {
    _id: "book-8",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    category: "Commerce",
    price: 280,
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80",
    description: "A solid understanding of economic principles for commerce students and learners.",
  },
  {
    _id: "book-9",
    title: "Business Law Essentials",
    author: "S. R. Singh",
    category: "Law",
    price: 260,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    description: "A practical overview of legal principles and corporate governance basics.",
  },
  {
    _id: "book-10",
    title: "Psychology and Behavior",
    author: "Daniel Goleman",
    category: "Psychology",
    price: 310,
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    description: "An approachable study of human behavior, mindset, and emotional intelligence.",
  },
  {
    _id: "book-11",
    title: "World History Timeline",
    author: "R. K. Sharma",
    category: "History",
    price: 295,
    coverImage: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=800&q=80",
    description: "A chronological look at major events and societies across world history.",
  },
  {
    _id: "book-12",
    title: "Political Science Basics",
    author: "A. K. Mehta",
    category: "Political Science",
    price: 270,
    coverImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
    description: "A concise guide to democratic systems, institutions, and public policy.",
  },
  {
    _id: "book-13",
    title: "Environmental Studies",
    author: "L. N. Gupta",
    category: "Environmental Science",
    price: 290,
    coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    description: "Covers ecology, sustainability, and key environmental challenges.",
  },
  {
    _id: "book-14",
    title: "Journalism Fundamentals",
    author: "Meera Joshi",
    category: "Journalism",
    price: 240,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    description: "Introduces storytelling, reporting, and media ethics for aspiring journalists.",
  },
];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  async function issueBook(bookid) {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      showErrorToast("Please login to issue a book.");
      return;
    }

    showSuccessToast("Book issued successfully.");
    console.log("Issue book demo:", bookid);
  }

  function bookDetails(bookid) {
    navigate(`/bookdetails/${bookid}`);
  }

  useEffect(() => {
    setIsLoading(true);

    // Populate the list from the static demo catalog so the browsing page stays
    // usable in local or live demos without depending on a backend database.
    const demoData = demoBooks;
    setBooks(demoData);
    setFilteredBooks(demoData);
    const uniqueCategories = ["All", ...new Set(demoData.map((book) => book.category))];
    setCategories(uniqueCategories);
    setIsLoading(false);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterBooks(e.target.value, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterBooks(searchTerm, category);
  };

  const filterBooks = (search, category) => {
    let filtered = books;

    if (category !== "All") {
      filtered = filtered.filter((book) => book.category === category);
    }

    if (search) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };


  return (
    <div className="container-fluid books-container">
      <div className="row">
      
        <div className="col-md-3 p-4 sidebar">
          <h4 className="text-center mb-4">📚 Categories</h4>
          <div className="category-scroll">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`category-item ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-9 main-content">
          <div className="search-header p-3">
            <h2 className="page-title">All Books</h2>
            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="bi bi-search search-icon"></i>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="books-grid">
              {filteredBooks.map((book, index) => (
                <div key={index} className="book-card">
                  <div className="card-image-container">
                    <img
                      src={book.coverImage}
                      className="card-image"
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="book-badge">{book.category}</div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-author">By {book.author}</p>
                    <p className="card-description">{book.description}</p>
                    <div className="card-footer">
                      <span className="card-price">₹{book.price}</span>
                      <div className="card-actions">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => bookDetails(book._id)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => issueBook(book._id)}
                        >
                          Issue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books-found">
              <i className="bi bi-book-slash"></i>
              <h4>No books found!</h4>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;