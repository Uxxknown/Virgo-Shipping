/* global __firebase_config, __app_id, __initial_auth_token */
import React, { useState, useEffect } from 'react';
import { 
  Package, PlusCircle, LogOut, 
  ChevronRight 
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInAnonymously, 
  signInWithCustomToken, signOut 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, 
  onSnapshot, addDoc, updateDoc 
} from 'firebase/firestore';

// --- FIREBASE SETUP ---
// Using fallbacks to prevent "is not defined" errors during local linting
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "fallback", authDomain: "fallback", projectId: "fallback" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'swiftship-v1';

// --- CONFIG & CONSTANTS ---
const BRAND_NAME = "SwiftShip";
const PACKAGE_STATUSES = ['Expected', 'Received', 'In Transit', 'Cleared', 'Ready for Pickup', 'Delivered'];

// --- COMPONENTS ---

const Navbar = ({ user, setPage, logout }) => {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">{BRAND_NAME}</span>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-slate-500 mr-2">UID: {user.uid}</div>
                <button 
                  onClick={() => setPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Dashboard
                </button>
                <button onClick={logout} className="text-slate-600 hover:text-red-600 p-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('login')} className="text-slate-600 hover:text-blue-600 font-medium px-4">Login</button>
                <button onClick={() => setPage('register')} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = ({ setPage }) => (
  <div className="flex flex-col">
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
            Shop in the USA, <br />
            <span className="text-blue-600">Ship to Jamaica.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-lg">
            Reliable, affordable, and fast courier services. Get your own US mailing address and start shopping today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setPage('register')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
            >
              Get Your US Address <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const CustomerDashboard = ({ user, packages, onPreAlert }) => {
  const [showPreAlert, setShowPreAlert] = useState(false);
  const activePackages = packages.filter(p => p.status !== 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-2">Hello, {user.name}!</h2>
          <p className="text-blue-100">Suite: {user.suiteNumber}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
          <h3 className="font-bold text-lg mb-4">Your US Address</h3>
          <div className="space-y-2 font-mono text-sm">
            <p className="bg-slate-50 p-2 rounded">{user.name} / {user.suiteNumber}</p>
            <p className="bg-slate-50 p-2 rounded">8300 NW 123th Ave</p>
            <p className="bg-slate-50 p-2 rounded">Miami, FL 33166</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">My Shipments</h3>
          <button onClick={() => setShowPreAlert(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" /> Pre-Alert
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tracking Number</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{pkg.status}</span>
                  </td>
                  <td className="px-6 py-4 font-mono">{pkg.trackingNumber}</td>
                  <td className="px-6 py-4">{pkg.merchant}</td>
                  <td className="px-6 py-4">${pkg.valueUSD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPreAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">New Pre-Alert</h3>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onPreAlert({
                trackingNumber: formData.get('tracking'),
                merchant: formData.get('merchant'),
                valueUSD: parseFloat(formData.get('value') || '0'),
              });
              setShowPreAlert(false);
            }}>
              <input name="tracking" required placeholder="Tracking #" className="w-full p-3 rounded-xl border" />
              <input name="merchant" required placeholder="Merchant" className="w-full p-3 rounded-xl border" />
              <input type="number" name="value" step="0.01" required placeholder="Value (USD)" className="w-full p-3 rounded-xl border" />
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Save</button>
              <button type="button" onClick={() => setShowPreAlert(false)} className="w-full text-slate-500 mt-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ packages, updateStatus }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
          <tr>
            <th className="px-6 py-4">Suite #</th>
            <th className="px-6 py-4">Tracking</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {packages.map(pkg => (
            <tr key={pkg.id}>
              <td className="px-6 py-4 font-bold">{pkg.suite}</td>
              <td className="px-6 py-4 font-mono text-sm">{pkg.trackingNumber}</td>
              <td className="px-6 py-4">{pkg.status}</td>
              <td className="px-6 py-4">
                <select 
                  onChange={(e) => updateStatus(pkg.id, e.target.value)}
                  value={pkg.status}
                  className="p-1 border rounded text-sm"
                >
                  {PACKAGE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth Effect
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch user profile from private data
        const userDoc = await getDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data'));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), uid: u.uid });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync Effect
  useEffect(() => {
    if (!user) return;

    // Listen to Public Packages (Admin sees all, Users see theirs)
    const pkgQuery = collection(db, 'artifacts', appId, 'public', 'data', 'packages');
    const unsubPkgs = onSnapshot(pkgQuery, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPackages(data);
    }, (err) => console.error("Pkg sync error:", err));

    return () => unsubPkgs();
  }, [user]);

  const handleAuth = async ({ email, name, type }) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    if (type === 'register') {
      const suite = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
      const profileData = { name, email, role: 'customer', suiteNumber: suite, createdAt: new Date().toISOString() };
      
      await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), profileData);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', uid), { 
        name, suiteNumber: suite, uid 
      });

      setUser({ ...profileData, uid });
      setPage('dashboard');
    } else {
      const userDoc = await getDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({ ...userData, uid });
        setPage(userData.role === 'admin' ? 'admin-dashboard' : 'dashboard');
      } else {
        if (email.includes('admin')) {
            const adminData = { name: 'Admin', email, role: 'admin', suiteNumber: 'ADMIN' };
            await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), adminData);
            setUser({ ...adminData, uid });
            setPage('admin-dashboard');
        } else {
            alert("No account found. Please register.");
        }
      }
    }
  };

  const handlePreAlert = async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'packages'), {
      ...data,
      userId: user.uid,
      suite: user.suiteNumber,
      status: 'Expected',
      createdAt: new Date().toISOString()
    });
  };

  const updateStatus = async (pkgId, newStatus) => {
    const pkgRef = doc(db, 'artifacts', appId, 'public', 'data', 'packages', pkgId);
    await updateDoc(pkgRef, { status: newStatus });
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading SwiftShip Cloud...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} setPage={setPage} logout={() => { signOut(auth); setPage('home'); }} />
      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'login' && <AuthPage type="login" onAuth={handleAuth} setPage={setPage} />}
        {page === 'register' && <AuthPage type="register" onAuth={handleAuth} setPage={setPage} />}
        {page === 'dashboard' && user && (
          <CustomerDashboard 
            user={user} 
            packages={packages.filter(p => p.userId === user.uid)} 
            onPreAlert={handlePreAlert} 
          />
        )}
        {page === 'admin-dashboard' && user?.role === 'admin' && (
          <AdminPanel packages={packages} updateStatus={updateStatus} />
        )}
      </main>
    </div>
  );
}

// --- SUB-PAGES ---
const AuthPage = ({ type, onAuth, setPage }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onAuth({ email, name, type }); }} className="space-y-4">
          {type === 'register' && (
            <input placeholder="Full Name" required className="w-full p-3 border rounded-xl" onChange={e => setName(e.target.value)} />
          )}
          <input type="email" placeholder="Email" required className="w-full p-3 border rounded-xl" onChange={e => setEmail(e.target.value)} />
          <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">
            {type === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button onClick={() => setPage(type === 'login' ? 'register' : 'login')} className="w-full mt-4 text-sm text-blue-600">
          {type === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};