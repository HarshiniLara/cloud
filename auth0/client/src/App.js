import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import "./App.css";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </>
  );
};


const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

const SlamBook = () => {
  const [slambooks, setSlambooks] = useState([]);
  const [formData, setFormData] = useState({ name: '', contact: '', favcolor: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSlambooks();
  }, []);

  const fetchSlambooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/slam/get');
      setSlambooks(response.data);
    } catch (error) {
      console.error('Error fetching slambooks:', error);
    }
  };

  const handlePost = async () => {
    try {
      await axios.post('http://localhost:3001/slam/post', formData);
      fetchSlambooks();
      setFormData({ name: '', contact: '', favcolor: '' });
    } catch (error) {
      console.error('Error adding slambook:', error);
    }
  };

  const handlePut = async () => {
    try {
      const dataToSend = { id: editId, newName: formData.name, newContact: formData.contact, newFavcolor: formData.favcolor };
      await axios.put('http://localhost:3001/slam/put', dataToSend);
      fetchSlambooks();
      setFormData({ name: '', contact: '', favcolor: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error updating slambook:', error);
    }
  };

  const handleEdit = (id) => {
    const slambookToEdit = slambooks.find((slambook) => slambook._id === id);
    setFormData({ name: slambookToEdit.name, contact: slambookToEdit.contact, favcolor: slambookToEdit.favcolor });
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/slam/delete/${id}`);
      fetchSlambooks();
    } catch (error) {
      console.error('Error deleting slambook:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      handlePut();
    } else {
      handlePost();
    }
  };

  return (
    <div className="App">
      <h1>Slambook</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /><br></br>
        </label>
        <label>
          Contact:
          <input type="text" name="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required /><br></br>
        </label>
        <label>
          Favorite Color:
          <input type="text" name="favcolor" value={formData.favcolor} onChange={(e) => setFormData({ ...formData, favcolor: e.target.value })} required /><br></br>
        </label>
        <button type="submit">{editId !== null ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {slambooks.map((slambook) => (
          <li key={slambook._id}>
            {slambook._id === editId ? (
              <>
                {slambook.name} - {slambook.contact} - {slambook.favcolor}
              </>
            ) : (
              <>
                {slambook.name} - {slambook.contact} - {slambook.favcolor}
                <button onClick={() => handleEdit(slambook._id)}>Edit</button>
                <button onClick={() => handleDelete(slambook._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <Profile />
      <SlamBook />
      <Logout />
    </>
  )
}

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element = {<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
