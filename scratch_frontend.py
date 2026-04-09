import os

base_dir = r"c:\Users\tejsh\OneDrive\Desktop\crop-disease-project\frontend"

directories = [
    "src/components",
    "src/pages",
    "src/api",
    "src/context"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

# tailwind.config.js
files["tailwind.config.js"] = """
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        }
      }
    },
  },
  plugins: [],
}
"""

# src/index.css
files["src/index.css"] = """
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
}
"""

# src/api/axios.js
files["src/api/axios.js"] = """
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
"""

# src/context/AuthContext.jsx
files["src/context/AuthContext.jsx"] = """
import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // In a real app we might fetch user profile here
      setUser({ username: 'Farmer1' }); // Mocked user profile for now
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const res = await axios.post('/auth/login', formData);
    setToken(res.data.access_token);
  };

  const register = async (username, email, password) => {
    await axios.post('/auth/register', { username, email, password });
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
"""

# src/components/Navbar.jsx
files["src/components/Navbar.jsx"] = """
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-nature-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-nature-100" />
            <span className="font-bold text-xl tracking-tight">AgriSmart AI</span>
          </Link>
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <Link to="/" className="hover:text-nature-200 transition">Dashboard</Link>
                <Link to="/history" className="hover:text-nature-200 transition">History</Link>
                <button onClick={logout} className="flex items-center space-x-1 hover:text-red-300 transition">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
               <div className="space-x-4">
                 <Link to="/login" className="hover:text-nature-200 transition">Login</Link>
                 <Link to="/register" className="bg-nature-100 text-nature-900 px-4 py-2 rounded-md font-medium hover:bg-white transition">Register</Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
"""

# src/pages/Dashboard.jsx
files["src/pages/Dashboard.jsx"] = """
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, Info, MapPin, Wind } from 'lucide-react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState("Connecting...");

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/v1/ws/status');
    ws.onopen = () => setWsStatus("Connected to AI model");
    ws.onmessage = (event) => console.log('WS Data:', event.data);
    ws.onclose = () => setWsStatus("Disconnected");
    return () => ws.close();
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png']}
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Disease Diagnosis</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${wsStatus === 'Connected to AI model' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
           <div className={`w-2 h-2 rounded-full mr-2 ${wsStatus === 'Connected to AI model' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
           {wsStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Image</h2>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? 'border-nature-500 bg-nature-50' : 'border-gray-300 hover:border-nature-500 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Upload preview" className="mx-auto max-h-64 rounded-lg object-contain" />
            ) : (
              <div className="space-y-4">
                <UploadCloud className="w-16 h-16 text-nature-500 mx-auto" />
                <div className="text-gray-600">
                  <p className="text-lg font-medium">Drag & drop a leaf image here</p>
                  <p className="text-sm">or click to select file</p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className={`mt-6 w-full py-3 rounded-xl font-medium text-white transition-all transform active:scale-95 ${
              !file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-nature-600 hover:bg-nature-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing AI Analysis...
              </span>
            ) : "Analyze Crop"}
          </button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start h-fit">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Analysis Failed</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                   <CheckCircle className="w-6 h-6 text-nature-500 mr-2" />
                   Diagnostic Report
                 </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Detected Crop</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{result.crop_type}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${result.disease_status === 'Healthy' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="text-sm font-medium uppercase tracking-wider mb-1" style={{ color: result.disease_status === 'Healthy' ? '#166534' : '#991b1b' }}>Status</p>
                    <p className="text-xl font-bold" style={{ color: result.disease_status === 'Healthy' ? '#14532d' : '#7f1d1d' }}>{result.disease_status}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Confidence Score</span>
                    <span className="text-2xl font-bold text-nature-600">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-nature-500 h-3 rounded-full" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${result.confidence}%` }} 
                      transition={{ duration: 1, ease: 'easeOut' }}
                    ></motion.div>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 relative overflow-hidden">
                  <div className="flex items-start z-10 relative">
                    <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-lg mb-2">Treatment Recommendation</h4>
                      <p className="text-blue-800 leading-relaxed">{result.treatment_recommendation}</p>
                    </div>
                  </div>
                </div>
                
                {result.heatmap_path && (
                  <div className="mt-8">
                     <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Wind className="w-5 h-5 mr-2 text-gray-500" />
                        Grad-CAM Explainable AI Heatmap
                     </h4>
                     <img src={`http://localhost:8000${result.heatmap_path}`} alt="Grad-CAM" className="rounded-xl w-full max-h-64 object-cover border" />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
"""

# src/pages/History.jsx
files["src/pages/History.jsx"] = """
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Clock, Activity, Leaf } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/history/');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading history...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Clock className="w-8 h-8 text-nature-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Diagnosis History</h1>
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
           <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-medium text-gray-600">No predictions found</h3>
           <p className="text-gray-500 mt-2">Upload a leaf image to generate your first diagnostic report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-100 relative">
                <img src={`http://localhost:8000${item.image_path}`} alt={item.crop_type} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${item.disease_status === 'Healthy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {item.disease_status}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center">
                    <Leaf className="w-4 h-4 text-nature-500 mr-2" />
                    {item.crop_type}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">{item.confidence}%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                   <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                   <p className="text-sm text-gray-800 line-clamp-2">{item.treatment_recommendation}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
"""

# src/pages/Login.jsx
files["src/pages/Login.jsx"] = """
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-transparent outline-none" />
          </div>
          <button type="submit" className="w-full bg-nature-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-nature-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
"""

# src/pages/Register.jsx
files["src/pages/Register.jsx"] = """
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nature-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-nature-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-nature-700 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
"""

# src/App.jsx
files["src/App.jsx"] = """
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Navbar />
          <main className="py-6">
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
"""

# src/main.jsx
files["src/main.jsx"] = """
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
"""

for filepath, content in files.items():
    full_path = os.path.join(base_dir, filepath)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\\n")
    print(f"Created {full_path}")
