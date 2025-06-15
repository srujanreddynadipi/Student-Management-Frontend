import React, { useEffect, useState } from 'react';
import './App.css';
import friendsImage from './friends.jpg'; // Ensure you have this image in your src folder

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    mobile: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    college: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch('https://student-management-backend-mojl.onrender.com/api/students')

      .then(response => response.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      fetch(`https://student-management-backend-mojl.onrender.com/api/students/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          fetchStudents();
          setMessage({ text: 'Student deleted successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
      })
      .catch(err => {
        console.error('Error deleting student:', err);
        setMessage({ text: 'Error deleting student', type: 'error' });
      });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent(student);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingStudent 
  ? `https://student-management-backend-mojl.onrender.com/api/students/${editingStudent._id}`
  : 'https://student-management-backend-mojl.onrender.com/api/students';

    
    const method = editingStudent ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent)
    })
    .then(response => response.json())
    .then(data => {
      setNewStudent({
        name: '', email: '', mobile: '', age: '',
        gender: '', city: '', state: '', country: '', college: ''
      });
      setShowForm(false);
      setEditingStudent(null);
      fetchStudents();
      setMessage({ 
        text: `Student ${editingStudent ? 'updated' : 'added'} successfully!`, 
        type: 'success' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    })
    .catch(err => {
      console.error('Error:', err);
      setMessage({ text: 'Error saving student', type: 'error' });
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="title">Bakwas Friends</h1>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="controls">
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add 
        </button>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="birthday-image-container">
        <img 
          src={friendsImage} 
          alt="Friends " 
          className="birthday-image"
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newStudent.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile"
                  value={newStudent.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={newStudent.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  name="gender"
                  value={newStudent.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={newStudent.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={newStudent.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={newStudent.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="college"
                  placeholder="College"
                  value={newStudent.college}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading students data...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Age</th>
                <th>Gender</th>
                <th>City</th>
                <th>College</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.mobile}</td>
                  <td>{student.age}</td>
                  <td>{student.gender}</td>
                  <td>{student.city}</td>
                  <td>{student.college}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    {deleteId === student._id ? (
                      <div className="delete-confirm">
                        <span>Are you sure?</span>
                        <button 
                          className="confirm-btn"
                          onClick={() => handleDelete(student._id)}
                        >
                          Yes
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => setDeleteId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;