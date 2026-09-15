import { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import "./profile.css";
import { getAuthToken } from "../../utils/auth";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

function ProfilePage() {
  const [user, setUser] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedRequests, setIssuedRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [libraryStatus, setLibraryStatus] = useState({ status: 'Out of Library', checkInTime: null, checkOutTime: null });
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitType, setVisitType] = useState('checkin');
  const [visitTimestamp, setVisitTimestamp] = useState('');

  const fetchIssuedBooks = async () => {
    try {
      const url = Server_URL + "books/issued";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const books = response.data.issuedBooks || [];
      setAllBooks(books);
      setIssuedBooks(books.filter(b => b.status === "Issued"));
      setIssuedRequests(books.filter(b => b.status === "Requested"));
      setReturnRequests(books.filter(b => b.status === "Requested Return"));
    } catch (error) {
      console.error("Error fetching issued books:", error.message);
    }
  };
  async function fetchProfile() {
    try {
      const response = await axios.get(`${Server_URL}users/profile`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      
      const { user } = response.data;
      setUser(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function fetchLibraryStatus() {
    try {
      const response = await axios.get(`${Server_URL}users/library-status`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setLibraryStatus(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching library status:", error.message);
      return null;
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchIssuedBooks();
    fetchLibraryStatus().then((status) => {
      if (status && status.status !== 'In Library') {
        setVisitTimestamp(getLocalDateTimeValue(new Date()));
        setVisitType('checkin');
        setShowVisitModal(true);
      }
    });
  }, []);

  function getLocalDateTimeValue(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  async function handleCheckIn(selectedTime = visitTimestamp) {
    try {
      setLoadingVisit(true);
      const response = await axios.post(`${Server_URL}users/checkin`, {
        checkInTime: selectedTime ? new Date(selectedTime).toISOString() : new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      showSuccessToast(response.data.message);
      setShowVisitModal(false);
      await fetchLibraryStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Could not check in.');
    } finally {
      setLoadingVisit(false);
    }
  }

  async function handleCheckOut(selectedTime = visitTimestamp) {
    try {
      setLoadingVisit(true);
      const response = await axios.post(`${Server_URL}users/checkout`, {
        checkOutTime: selectedTime ? new Date(selectedTime).toISOString() : new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      showSuccessToast(response.data.message);
      setShowVisitModal(false);
      await fetchLibraryStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Could not check out.');
    } finally {
      setLoadingVisit(false);
    }
  }

  async function returnBook(borrowId) {
    try {
      const response = await axios.put(
        `${Server_URL}books/returnrequest/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      showSuccessToast(response.data.message);
      fetchIssuedBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      showErrorToast(error.response?.data?.message || "Something went wrong!");
    }
  }

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-info card">
          <h1>{user.name}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <div className="library-status-box">
            <h3>Library Visit Status</h3>
            <p>
              <strong>Status:</strong>{' '}
              <span className={libraryStatus.status === 'In Library' ? 'status-live' : 'status-away'}>
                {libraryStatus.status}
              </span>
              {libraryStatus.status === 'In Library' && (
                <span className="live-indicator" style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
                  <span className="live-dot"></span>
                  Live Student
                </span>
              )}
            </p>
            <p><strong>Check In:</strong> {libraryStatus.checkInTime ? new Date(libraryStatus.checkInTime).toLocaleString() : 'Not checked in yet'}</p>
            <p><strong>Check Out:</strong> {libraryStatus.checkOutTime ? new Date(libraryStatus.checkOutTime).toLocaleString() : 'Not checked out yet'}</p>
            <div className="library-visit-actions">
              <button className="checkin-btn" onClick={() => {
                setVisitType('checkin');
                setVisitTimestamp(getLocalDateTimeValue(new Date()));
                setShowVisitModal(true);
              }} disabled={loadingVisit || libraryStatus.status === 'In Library'}>
                Check In
              </button>
              <button className="checkout-btn" onClick={() => {
                setVisitType('checkout');
                setVisitTimestamp(getLocalDateTimeValue(new Date()));
                setShowVisitModal(true);
              }} disabled={loadingVisit || libraryStatus.status !== 'In Library'}>
                Check Out
              </button>
            </div>
          </div>
        </div>

        {showVisitModal && (
          <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="modal-card" style={{ background: '#fff', width: 'min(420px, 90vw)', borderRadius: '14px', padding: '24px', boxShadow: '0 18px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginBottom: '12px' }}>{visitType === 'checkin' ? 'Library In-Time' : 'Library Out-Time'}</h3>
              <p style={{ marginBottom: '16px', color: '#555' }}>
                {visitType === 'checkin'
                  ? 'Please confirm the student in-time before entering the library.'
                  : 'Please confirm the student out-time before leaving the library.'}
              </p>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Date & Time</label>
              <input
                type="datetime-local"
                value={visitTimestamp}
                onChange={(e) => setVisitTimestamp(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '18px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowVisitModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={visitType === 'checkin' ? 'btn btn-primary' : 'btn btn-success'}
                  onClick={() => {
                    if (visitType === 'checkin') {
                      handleCheckIn(visitTimestamp);
                    } else {
                      handleCheckOut(visitTimestamp);
                    }
                  }}
                >
                  {visitType === 'checkin' ? 'Save In-Time' : 'Save Out-Time'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="profile-sections">
          <div className="section-card issued-books">
            <h2>📚 Issued Books</h2>
            {issuedBooks.length === 0 ? (
              <p>No books currently issued.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookId.title}</td>
                      <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                      <td><span className="badge issued">{book.status}</span></td>
                      <td>₹{book.fine}</td>
                      <td>
                        <button
                          className="return-btn"
                          onClick={() => returnBook(book._id)}
                        >
                          Request Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="section-card issued-requests">
            <h2>📝 Issued Requests</h2>
            {issuedRequests.length === 0 ? (
              <p>No pending issue requests.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Request Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedRequests.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookId.title}</td>
                      <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                      <td><span className="badge requested">{book.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="section-card return-requests">
            <h2>🔄 Return Requests</h2>
            {returnRequests.length === 0 ? (
              <p>No pending return requests.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Request Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnRequests.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookId.title}</td>
                      <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                      <td><span className="badge return-requested">{book.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
