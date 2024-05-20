// import { useState, useEffect } from "react";
// import "./App.css";
// import { db } from "./firebase-config";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";

// function App() {
//   const [formData, setFormData] = useState({ name: "", contact: "", favcolor: "" });
//   const [users, setUsers] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const usersCollectionRef = collection(db, "users");

//   const createUser = async () => {
//     await addDoc(usersCollectionRef, { ...formData });
//     setFormData({ name: "", contact: "", favcolor: "" });
//     fetchUsers();
//   };

//   const updateUser = async (id) => {
//     const userDoc = doc(db, "users", id);
//     await updateDoc(userDoc, { ...formData });
//     setEditId(null);
//     setFormData({ name: "", contact: "", favcolor: "" });
//     fetchUsers();
//   };

//   const deleteUser = async (id) => {
//     const userDoc = doc(db, "users", id);
//     await deleteDoc(userDoc);
//     fetchUsers();
//   };

//   const fetchUsers = async () => {
//     const data = await getDocs(usersCollectionRef);
//     setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editId) {
//       updateUser(editId);
//     } else {
//       createUser();
//     }
//   };

//   const handleEdit = (user) => {
//     setFormData({ name: user.name, contact: user.contact, favcolor: user.favcolor });
//     setEditId(user.id);
//   };

//   return (
//     <div className="App">
//       <h1>User Management</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Name..."
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Contact..."
//           value={formData.contact}
//           onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Favorite Color..."
//           value={formData.favcolor}
//           onChange={(e) => setFormData({ ...formData, favcolor: e.target.value })}
//           required
//         />
//         <button type="submit">{editId ? "Update User" : "Add User"}</button>
//       </form>

//       {users.map((user) => (
//         <div key={user.id} className="user-card">
//           <h2>Name: {user.name}</h2>
//           <p>Contact: {user.contact}</p>
//           <p>Favorite Color: {user.favcolor}</p>
//           <button onClick={() => handleEdit(user)}>Edit</button>
//           <button onClick={() => deleteUser(user.id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from "react";
import "./App.css";
import { db, auth, analytics } from "./firebase-config";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


function App() {
  const [formData, setFormData] = useState({ name: "", contact: "", favcolor: "" });
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    // analytics.logEvent("app_loaded");
  }, []);

  const fetchUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      } else {
        await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      }
      setAuthForm({ email: "", password: "" });
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUsers([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateUser(editId);
    } else {
      createUser();
    }
  };

  const createUser = async () => {
    await addDoc(usersCollectionRef, { ...formData });
    setFormData({ name: "", contact: "", favcolor: "" });
    fetchUsers();
  };

  const updateUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { ...formData });
    setEditId(null);
    setFormData({ name: "", contact: "", favcolor: "" });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, contact: user.contact, favcolor: user.favcolor });
    setEditId(user.id);
  };

  if (!user) {
    return (
      <div className="App">
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email..."
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password..."
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
          />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>User Management</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Contact..."
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Favorite Color..."
          value={formData.favcolor}
          onChange={(e) => setFormData({ ...formData, favcolor: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Update User" : "Add User"}</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="user-card">
          <h2>Name: {user.name}</h2>
          <p>Contact: {user.contact}</p>
          <p>Favorite Color: {user.favcolor}</p>
          <button onClick={() => handleEdit(user)}>Edit</button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
