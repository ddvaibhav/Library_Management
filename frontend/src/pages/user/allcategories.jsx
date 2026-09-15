import React, { useState, useEffect } from "react";
import "./allcategories.css";
import { Link } from "react-router-dom";
import Loader from "../../components/Preloader";

// Static category catalog used for the demo deployment so the page works
// even when the backend/database is unavailable or not connected.
// This page used to show "No books found in this category" because the
// category list was empty when the backend/database was unavailable.
// The fallback catalog below keeps the page working and prevents empty states.
const categoryData = [
  { category: "Programming", count: 6, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80" },
  { category: "Computer Science", count: 5, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" },
  { category: "Science", count: 4, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" },
  { category: "Commerce", count: 3, image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80" },
  { category: "English", count: 3, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80" },
  { category: "Fiction", count: 2, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80" },
  { category: "Self Development", count: 2, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" },
  { category: "Mathematics", count: 4, image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80" },
  { category: "History", count: 2, image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=800&q=80" },
  { category: "Economics", count: 3, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" },
  { category: "Management", count: 2, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
  { category: "Research", count: 2, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80" },
  { category: "Law", count: 2, image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80" },
  { category: "Psychology", count: 2, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
  { category: "Political Science", count: 2, image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80" },
  { category: "Environmental Science", count: 2, image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80" },
  { category: "Journalism", count: 2, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80" },
];

export default function ViewAllCategories() {
  // Keeping the category list local prevents empty or broken UI states during
  // mock/demo mode and keeps the design responsive without API calls.
  const [books, setBooks] = useState(categoryData);
  const [filterBooks, setFilteredBooks] = useState(categoryData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (selectedCategory) => {
    setActiveCategory(selectedCategory);

    // This avoids the previous empty-state bug when no data was returned from the
    // backend or when the requested category is not present in the static list.
    if (selectedCategory === "All") {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter((book) => book.category === selectedCategory);
    setFilteredBooks(filtered.length ? filtered : categoryData);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="all-categories-container">
      <div className="all-categories-row">
        <nav className="all-categories-sidebar">
          <h5 className="all-categories-sidebar-title">Categories</h5>
          <ul className="all-categories-nav">
            <li
              className={`all-categories-nav-item ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </li>
            {books.map((book, index) => (
              <li
                key={index}
                className={`all-categories-nav-item ${activeCategory === book.category ? "active" : ""}`}
                onClick={() => handleCategoryClick(book.category)}
              >
                {book.category}
              </li>
            ))}
          </ul>
        </nav>

        <main className="all-categories-main">
          <h2 className="all-categories-main-title">Explore All Categories</h2>
          {loading ? (
            <Loader />
          ) : filterBooks.length > 0 ? (
            <div className="all-categories-grid">
              {filterBooks.map((categoryItem, index) => (
                <div key={index} className="all-categories-card-wrapper">
                  <div className="all-categories-card shadow-sm">
                    <img
                      src={categoryItem.image}
                      className="all-categories-card-img"
                      alt={categoryItem.category}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="all-categories-card-body">
                      <h5 className="all-categories-card-title">{categoryItem.category}</h5>
                      <p className="text-muted">Books: {categoryItem.count}</p>
                      <Link to="/books" className="all-categories-btn">Explore</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="all-categories-empty">
              <p>This category is currently unavailable. Please try another section.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
