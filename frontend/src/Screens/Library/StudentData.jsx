import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { baseApiURL } from "../../baseUrl";

const StudentData = () => {
  const [studentQuery, setStudentQuery] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [bookQuery, setBookQuery] = useState("");
  const [bookResults, setBookResults] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  // New state for book check functionality
  const [bookCheckQuery, setBookCheckQuery] = useState("");
  const [bookCheckResults, setBookCheckResults] = useState([]);
  const [studentsWithBook, setStudentsWithBook] = useState([]);
  const [showBookCheck, setShowBookCheck] = useState(false);

  // Debounced Student Search
  const fetchStudents = useCallback(
    debounce(async (query) => {
      if (!query) return setStudentResults([]);
      try {
        const res = await axios.get(`${baseApiURL()}/student/details/search?query=${query}`);
        setStudentResults(res.data.students || []);
      } catch (err) {
        console.error(err);
      }
    }, 300),
    []
  );

  // Debounced Book Search
  const fetchBooks = useCallback(
    debounce(async (query) => {
      if (!query) return setBookResults([]);
      try {
        const res = await axios.get(`${baseApiURL()}/library/search`, {
          params: { query }
        });
        setBookResults(res.data.books || []);
      } catch (err) {
        console.error(err);
      }
    }, 300),
    []
  );

  // New debounced book borrower search
  const checkBookBorrowers = useCallback(
    debounce(async (query) => {
      if (!query) {
        setBookCheckResults([]);
        setStudentsWithBook([]);
        return;
      }
      try {
        // First search for matching books
        const bookRes = await axios.get(`${baseApiURL()}/library/search`, {
          params: { query }
        });
        setBookCheckResults(bookRes.data.books || []);

        // If we found books, check who has them
        if (bookRes.data.books?.length > 0) {
          const bookId = bookRes.data.books[0]._id;
          const studentsRes = await axios.get(`${baseApiURL()}/student/details/findByBook`, {
            params: { bookId }
          });
          setStudentsWithBook(studentsRes.data.students || []);
        } else {
          setStudentsWithBook([]);
        }
      } catch (err) {
        console.error(err);
        setStudentsWithBook([]);
      }
    }, 500),
    []
  );

  // Load student's issued books when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      const loadIssuedBooks = async () => {
        try {
          const res = await axios.get(`${baseApiURL()}/student/details/getDetailsByEnrollment`, {
            params: { enrollmentNo: selectedStudent.enrollmentNo }
          });
          const issued = res.data.user[0]?.books.filter(book => book.status === 'issued') || [];
          setIssuedBooks(issued);
        } catch (err) {
          console.error(err);
        }
      };
      loadIssuedBooks();
    }
  }, [selectedStudent]);

  // Assign books
  const assignBooks = async () => {
    if (!selectedStudent || !selectedBooks.length) {
      alert("Please select both a student and books");
      return;
    }
  
    try {
      const res = await axios.post(`${baseApiURL()}/student/details/assignBooks`, {
        enrollmentNo: selectedStudent.enrollmentNo,
        bookIds: selectedBooks.map(book => book._id),
      });
  
      if (res.data.success) {
        if (res.data.message.includes("already assigned")) {
          alert(res.data.message);
        } else {
          alert(`Success! ${res.data.message}`);
        }
        
        // Refresh data
        const updated = await axios.get(`${baseApiURL()}/student/details/getDetailsByEnrollment`, {
          params: { enrollmentNo: selectedStudent.enrollmentNo }
        });
        
        setIssuedBooks(updated.data.user[0]?.books?.filter(b => b.status === 'issued') || []);
        setSelectedBooks([]);
        setBookQuery("");
        setBookResults([]);
      } else {
        alert(res.data.message || "Assignment failed");
      }
    } catch (err) {
      console.error("Assignment error:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Return books
  const returnBooks = async () => {
    if (!selectedStudent || !selectedBooks.length) {
      alert("Please select both a student and books to return");
      return;
    }
  
    try {
      const confirmation = window.confirm(
        `Return ${selectedBooks.length} book(s) from ${selectedStudent.firstName}?`
      );
      
      if (!confirmation) return;
  
      const res = await axios.post(`${baseApiURL()}/student/details/returnBooks`, {
        enrollmentNo: selectedStudent.enrollmentNo,
        bookIds: selectedBooks.map(book => book._id),
      });
  
      if (res.data.success) {
        alert(`Success! ${res.data.message}`);
        // Refresh the issued books list
        const updated = await axios.get(`${baseApiURL()}/student/details/getDetailsByEnrollment`, {
          params: { enrollmentNo: selectedStudent.enrollmentNo }
        });
        setIssuedBooks(updated.data.user[0]?.books?.filter(b => b.status === 'issued') || []);
        setSelectedBooks([]);
      } else {
        alert(res.data.message || "Return failed");
      }
    } catch (err) {
      console.error("Return error:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Library Management</h1>
      
      {/* New Book Check Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setShowBookCheck(!showBookCheck)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {showBookCheck ? "Hide Book Check" : "View Who Took The Book"}
        </button>
      </div>

      {/* Student Search */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Search Student</h2>
        <input
          type="text"
          value={studentQuery}
          onChange={(e) => {
            setStudentQuery(e.target.value);
            fetchStudents(e.target.value);
          }}
          placeholder="Search by name or enrollment number"
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
        />
        {studentResults.length > 0 && (
          <ul style={{ 
            border: "1px solid #ccc", 
            maxHeight: "150px", 
            overflowY: "auto", 
            listStyle: "none", 
            padding: 0,
            margin: "5px 0 0 0"
          }}>
            {studentResults.map((student) => (
              <li
                key={student._id}
                onClick={() => {
                  setSelectedStudent(student);
                  setStudentQuery(`${student.firstName} ${student.lastName}`);
                  setStudentResults([]);
                }}
                style={{ 
                  cursor: "pointer", 
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: selectedStudent?._id === student._id ? "#f0f0f0" : "white",
                  ":hover": {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                {student.firstName} {student.lastName} ({student.enrollmentNo})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Student Info */}
      {selectedStudent && (
        <div style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #ddd", 
          borderRadius: "5px",
          backgroundColor: "#f9f9f9"
        }}>
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
          <p><strong>Enrollment No:</strong> {selectedStudent.enrollmentNo}</p>
          <p><strong>Branch:</strong> {selectedStudent.branch}</p>
          <p><strong>Semester:</strong> {selectedStudent.semester}</p>
        </div>
      )}

      {/* Book Search */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Search Books</h2>
        <input
          type="text"
          value={bookQuery}
          onChange={(e) => {
            setBookQuery(e.target.value);
            fetchBooks(e.target.value);
          }}
          placeholder="Search by book name or author"
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
        />
        {bookResults.length > 0 && (
          <ul style={{ 
            border: "1px solid #ccc", 
            maxHeight: "150px", 
            overflowY: "auto", 
            listStyle: "none", 
            padding: 0,
            margin: "5px 0 0 0"
          }}>
            {bookResults.map((book) => (
              <li
                key={book._id}
                onClick={() => {
                  if (!selectedBooks.find((b) => b._id === book._id)) {
                    setSelectedBooks([...selectedBooks, book]);
                  } else {
                    setSelectedBooks(selectedBooks.filter((b) => b._id !== book._id));
                  }
                }}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: selectedBooks.find((b) => b._id === book._id)
                    ? "#d3f9d8"
                    : "white",
                  ":hover": {
                    backgroundColor: "#f5f5f5"
                  }
                }}
              >
                {book.bookName} by {book.author} (Available: {book.quantity - (book.issuedCount || 0)})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Books */}
      {selectedBooks.length > 0 && (
        <div style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #ddd", 
          borderRadius: "5px",
          backgroundColor: "#f0f7ff"
        }}>
          <h3>Selected Books</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedBooks.map((book) => (
              <li key={book._id} style={{ padding: "5px 0" }}>
                {book.bookName} by {book.author}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "30px",
        justifyContent: "center"
      }}>
        <button
          onClick={assignBooks}
          disabled={!selectedStudent || selectedBooks.length === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: (!selectedStudent || selectedBooks.length === 0) ? 0.5 : 1
          }}
        >
          Assign Books
        </button>
        <button
          onClick={returnBooks}
          disabled={!selectedStudent || selectedBooks.length === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: (!selectedStudent || selectedBooks.length === 0) ? 0.5 : 1
          }}
        >
          Return Books
        </button>
      </div>

      {/* Issued Books List */}
      {selectedStudent && issuedBooks.length > 0 && (
        <div style={{ 
          marginTop: "30px", 
          padding: "15px", 
          border: "1px solid #ddd", 
          borderRadius: "5px",
          backgroundColor: "#fff9f9"
        }}>
          <h3>Currently Issued Books</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Book Name</th>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Author</th>
                <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Issued Date</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book) => (
                <tr key={book.bookId} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{book.bookId?.bookName || 'N/A'}</td>
                  <td style={{ padding: "8px" }}>{book.bookId?.author || 'N/A'}</td>
                  <td style={{ padding: "8px" }}>{formatDate(book.issueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Check Modal */}
      {showBookCheck && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <h2 style={{ marginBottom: "20px" }}>Check Book Borrowers</h2>
            
            <input
              type="text"
              value={bookCheckQuery}
              onChange={(e) => {
                setBookCheckQuery(e.target.value);
                checkBookBorrowers(e.target.value);
              }}
              placeholder="Search book by name or author"
              style={{ width: "100%", padding: "8px", fontSize: "16px", marginBottom: "20px" }}
            />

            {bookCheckResults.length > 0 && (
              <div>
                <h3>Matching Books:</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {bookCheckResults.map(book => (
                    <li key={book._id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                      {book.bookName} by {book.author} (Available: {book.quantity - (book.issuedCount || 0)}/{book.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {studentsWithBook.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Students who have this book:</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Enrollment</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsWithBook.map(student => (
                      <tr key={student._id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px" }}>
                          {student.firstName} {student.lastName}
                        </td>
                        <td style={{ padding: "8px" }}>{student.enrollmentNo}</td>
                        <td style={{ padding: "8px" }}>{student.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {bookCheckQuery && studentsWithBook.length === 0 && bookCheckResults.length > 0 && (
              <p style={{ marginTop: "20px" }}>No students currently have this book checked out.</p>
            )}

            <button
              onClick={() => setShowBookCheck(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentData;