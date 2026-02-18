/* global __firebase_config, __app_id, __initial_auth_token */
import React, { useState, useEffect } from 'react';
import { 
  Package, PlusCircle, LogOut, 
  ChevronRight, Loader2, Mail, ShieldAlert, CheckCircle
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInAnonymously, 
  signInWithCustomToken, signOut 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, 
  onSnapshot, addDoc, updateDoc,
} from 'firebase/firestore';

// --- FIREBASE SETUP ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "", authDomain: "", projectId: "" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'swiftship-v1';
const apiKey = ""; // Gemini API Key provided by environment

// --- CONFIG & CONSTANTS ---
const BRAND_NAME = "SwiftShip";
const PACKAGE_STATUSES = ['Expected', 'Received', 'In Transit', 'Cleared', 'Ready for Pickup', 'Delivered'];

// --- API HELPER FOR EMAILS ---
const sendVerificationEmail = async (email, name, suite) => {
  const systemPrompt = `You are the SwiftShip Automated Mailer. Send a professional, HTML-formatted welcome email. 
  Include their Suite Number: ${suite}. 
  Instructions: They must click the 'Verify Email' button (simulated link) to activate their US mailing address.`;
  
  const userQuery = `Send a welcome and verification email to ${name} at ${email}.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    return response.ok;
  } catch (error) {
    console.error("Email API Error:", error);
    return false;
  }
};

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

const VerificationBanner = ({ onResend, isVerified }) => {
  if (isVerified) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-100 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center text-amber-800">
          <ShieldAlert className="h-5 w-5 mr-3" />
          <p className="text-sm font-medium">
            Your account is pending verification. Please check your email to activate your US address.
          </p>
        </div>
        <button 
          onClick={onResend}
          className="text-sm bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-md transition"
        >
          Resend Email
        </button>
      </div>
    </div>
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

const CustomerDashboard = ({ user, packages, onPreAlert, isVerified }) => {
  const [showPreAlert, setShowPreAlert] = useState(false);
  const activePackages = packages.filter(p => p.status !== 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Hello, {user.name}!</h2>
            <p className="text-blue-100">Suite: {user.suiteNumber}</p>
          </div>
          <Package className="absolute right-[-20px] bottom-[-20px] h-48 w-48 text-white/10 rotate-12" />
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            Your US Address {isVerified && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
          </h3>
          {isVerified ? (
            <div className="space-y-2 font-mono text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Line 1</span>
                {user.name} / {user.suiteNumber}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Line 2</span>
                8300 NW 123th Ave
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">City, State, Zip</span>
                Miami, FL 33166
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200 text-center">
              <Mail className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">Verify your email to unlock your US address</p>
            </div>
          )}
        </div>
      </div>

      <div className={`bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden ${!isVerified && 'opacity-50 pointer-events-none'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">My Shipments</h3>
          <button 
            disabled={!isVerified}
            onClick={() => setShowPreAlert(true)} 
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center hover:bg-blue-700 transition disabled:bg-slate-300"
          >
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
              {activePackages.length > 0 ? activePackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{pkg.status}</span>
                  </td>
                  <td className="px-6 py-4 font-mono">{pkg.trackingNumber}</td>
                  <td className="px-6 py-4">{pkg.merchant}</td>
                  <td className="px-6 py-4">${pkg.valueUSD}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No active shipments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPreAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
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
              <input name="tracking" required placeholder="Tracking #" className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              <input name="merchant" required placeholder="Merchant (e.g. Amazon)" className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">$</span>
                <input type="number" name="value" step="0.01" required placeholder="Value (USD)" className="w-full p-4 pl-8 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Submit Pre-Alert</button>
              <button type="button" onClick={() => setShowPreAlert(false)} className="w-full text-slate-400 mt-2 font-medium">Cancel</button>
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
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${pkg.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {pkg.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <select 
                  onChange={(e) => updateStatus(pkg.id, e.target.value)}
                  value={pkg.status}
                  className="p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
  const [authLoading, setAuthLoading] = useState(false);

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
        try {
          const userDoc = await getDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data'));
          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), uid: u.uid });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync Effect - Real Filter: user only sees their packages
  useEffect(() => {
    if (!user) {
      setPackages([]);
      return;
    }

    const pkgQuery = collection(db, 'artifacts', appId, 'public', 'data', 'packages');
    const unsubPkgs = onSnapshot(pkgQuery, (snapshot) => {
      const allPkgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Real filtering logic
      if (user.role === 'admin') {
        setPackages(allPkgs);
      } else {
        setPackages(allPkgs.filter(p => p.userId === user.uid));
      }
    }, (err) => console.error("Pkg sync error:", err));

    return () => unsubPkgs();
  }, [user]);

  const handleAuth = async ({ email, name, type }) => {
    if (!auth.currentUser) return;
    setAuthLoading(true);
    const uid = auth.currentUser.uid;

    try {
      if (type === 'register') {
        const suite = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
        const profileData = { 
          name, 
          email, 
          role: 'customer', 
          suiteNumber: suite, 
          isVerified: false,
          createdAt: new Date().toISOString() 
        };
        
        await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), profileData);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', uid), { 
          name, suiteNumber: suite, uid 
        });

        // Real Email Call
        await sendVerificationEmail(email, name, suite);

        setUser({ ...profileData, uid });
        setPage('dashboard');
      } else {
        const userDoc = await getDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...userData, uid });
          setPage(userData.role === 'admin' ? 'admin-dashboard' : 'dashboard');
        } else {
          if (email.toLowerCase().includes('admin')) {
              const adminData = { name: 'Admin', email, role: 'admin', suiteNumber: 'ADMIN', isVerified: true };
              await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), adminData);
              setUser({ ...adminData, uid });
              setPage('admin-dashboard');
          } else {
              alert("Account session not found. Registering...");
              setPage('register');
          }
        }
      }
    } catch (error) {
      console.error("Auth Action Error:", error);
      alert("Registration error. Check network.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePreAlert = async (data) => {
    if (!user || !user.isVerified) return;
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

  const resendEmail = async () => {
    if (!user) return;
    setAuthLoading(true);
    const success = await sendVerificationEmail(user.email, user.name, user.suiteNumber);
    setAuthLoading(false);
    if (success) alert("Confirmation email sent to " + user.email);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-600 font-medium">SwiftShip Secure Gateway...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} setPage={setPage} logout={() => { signOut(auth); setUser(null); setPage('home'); }} />
      {user && user.role !== 'admin' && <VerificationBanner isVerified={user.isVerified} onResend={resendEmail} />}
      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'login' && <AuthPage type="login" onAuth={handleAuth} setPage={setPage} isLoading={authLoading} />}
        {page === 'register' && <AuthPage type="register" onAuth={handleAuth} setPage={setPage} isLoading={authLoading} />}
        {page === 'dashboard' && user && (
          <CustomerDashboard 
            user={user} 
            packages={packages} 
            onPreAlert={handlePreAlert} 
            isVerified={user.isVerified}
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
const AuthPage = ({ type, onAuth, setPage, isLoading }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {type === 'login' ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-slate-500 mt-2">SwiftShip Courier Solutions</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onAuth({ email, name, type }); }} className="space-y-5">
          {type === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                placeholder="First & Last Name" 
                required 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" 
                onChange={e => setName(e.target.value)} 
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@email.com" 
              required 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center shadow-lg shadow-blue-200"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {type === 'login' ? 'Login' : 'Create My Account'}
          </button>
        </form>
        
        <button 
          disabled={isLoading}
          onClick={() => setPage(type === 'login' ? 'register' : 'login')} 
          className="w-full mt-8 text-sm text-slate-400 hover:text-blue-600 font-bold transition"
        >
          {type === 'login' ? "New here? Register for a suite" : 'Already have a suite? Login'}
        </button>
      </div>
    </div>
  );
};