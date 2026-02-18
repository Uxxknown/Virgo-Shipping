/* global __firebase_config, __app_id, __initial_auth_token */
import React, { useState, useEffect } from 'react';
import { 
  Package, PlusCircle, LogOut, 
  ChevronRight, Loader2, Mail, ShieldAlert, CheckCircle, RefreshCcw
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
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "", authDomain: "", projectId: "" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'swiftship-v1';
const apiKey = ""; // Gemini API Key

// --- CONFIG & CONSTANTS ---
const BRAND_NAME = "SwiftShip";
const PACKAGE_STATUSES = ['Expected', 'Received', 'In Transit', 'Cleared', 'Ready for Pickup', 'Delivered'];

// --- API HELPER FOR EMAILS ---
const sendVerificationEmail = async (email, name, suite) => {
  const systemPrompt = `You are the SwiftShip Automated Mailer. Send a professional welcome email. 
  Include their Suite Number: ${suite}. 
  Inform them that their dashboard is currently locked and they must click the 'Verify' button in their portal to begin shipping.`;
  
  const userQuery = `Generate and send a welcome email for ${name} (${email}). Suite: ${suite}`;

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
                <button onClick={logout} className="text-slate-600 hover:text-red-600 p-2 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('login')} className="text-slate-600 hover:text-blue-600 font-medium px-4">Login</button>
                <button onClick={() => setPage('register')} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md shadow-blue-100">
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

const VerificationBanner = ({ onVerify, isVerified, loading }) => {
  if (isVerified) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-100 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center text-amber-800">
          <ShieldAlert className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">
            Account Pending. Check your email or click verify to activate your US suite.
          </p>
        </div>
        <button 
          onClick={onVerify}
          disabled={loading}
          className="flex items-center text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg transition font-bold disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
          Verify Now
        </button>
      </div>
    </div>
  );
};

const HomePage = ({ setPage }) => (
  <div className="flex flex-col">
    <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Now Shipping to All Parishes</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
            USA Shopping, <br />
            <span className="text-blue-600 underline decoration-blue-200">Jamaica Delivery.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-lg leading-relaxed">
            SwiftShip provides a real US mailing address so you can shop Amazon, eBay, and more with zero hassle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setPage('register')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center group"
            >
              Get Started <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
        <div className="hidden lg:block relative">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Package Received</p>
                        <p className="text-xs text-slate-500">Miami Warehouse - 2 mins ago</p>
                    </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/3 animate-pulse"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">In Transit to Kingston</p>
            </div>
            <div className="absolute -top-10 -right-10 h-64 w-64 bg-blue-600/5 rounded-full blur-3xl"></div>
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
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}</h2>
            <p className="text-slate-400 font-mono tracking-wider">Suite ID: {user.suiteNumber}</p>
            <div className="mt-8 flex space-x-6">
                <div>
                    <p className="text-2xl font-bold">{activePackages.length}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Active Items</p>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Ready for Pickup</p>
                </div>
            </div>
          </div>
          <Package className="absolute right-[-40px] bottom-[-40px] h-64 w-64 text-white/5 -rotate-12" />
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-lg">US Shipping Address</h3>
            {isVerified ? (
                 <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Active</span>
            ) : (
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Locked</span>
            )}
          </div>
          {isVerified ? (
            <div className="space-y-3">
              <div className="group cursor-pointer">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Full Name & Suite</span>
                <p className="text-sm font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-blue-200 transition">{user.name} / {user.suiteNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Street Address</span>
                <p className="text-sm font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">8300 NW 123th Ave</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">City/State</span>
                    <p className="text-sm font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">Miami, FL</p>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Zip Code</span>
                    <p className="text-sm font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">33166</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 h-56 rounded-2xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200">
              <div className="bg-white h-12 w-12 rounded-full shadow-sm flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">Activation Required</p>
              <p className="text-xs text-slate-400">Complete verification to view your US address and start shipping.</p>
            </div>
          )}
        </div>
      </div>

      <div className={`bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden ${!isVerified && 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-8 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Package Tracking</h3>
            <p className="text-sm text-slate-500">Manage and track your incoming shipments</p>
          </div>
          <button 
            disabled={!isVerified}
            onClick={() => setShowPreAlert(true)} 
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> New Pre-Alert
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="px-8 py-5">Shipment Status</th>
                <th className="px-8 py-5">Carrier Tracking</th>
                <th className="px-8 py-5">Merchant</th>
                <th className="px-8 py-5">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePackages.length > 0 ? activePackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        pkg.status === 'Expected' ? 'bg-slate-100 text-slate-600' :
                        pkg.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {pkg.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-mono text-sm font-bold text-slate-700">{pkg.trackingNumber}</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">Updated {new Date(pkg.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900">{pkg.merchant}</td>
                  <td className="px-8 py-6 font-bold text-slate-900">${pkg.valueUSD.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                        <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-900 font-bold">No Shipments Found</p>
                        <p className="text-sm text-slate-400 mt-1">Packages will appear here once you add a pre-alert or they arrive at our warehouse.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPreAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowPreAlert(false)} className="text-slate-400 hover:text-slate-900 font-bold">Close</button>
            </div>
            <h3 className="text-3xl font-bold mb-2">Create Pre-Alert</h3>
            <p className="text-slate-500 mb-8">Tell us about your incoming package to speed up processing.</p>
            
            <form className="grid grid-cols-1 gap-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onPreAlert({
                trackingNumber: formData.get('tracking'),
                merchant: formData.get('merchant'),
                valueUSD: parseFloat(formData.get('value') || '0'),
              });
              setShowPreAlert(false);
            }}>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Carrier Tracking #</label>
                <input name="tracking" required placeholder="Ex: 1Z999AA10123" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Merchant Name</label>
                <input name="merchant" required placeholder="Ex: Amazon, Shein, Walmart" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Value (USD)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input type="number" name="value" step="0.01" required placeholder="0.00" className="w-full p-4 pl-8 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                </div>
              </div>
              <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                Register Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ packages, updateStatus }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Warehouse Ops</h2>
            <p className="text-slate-500">Managing global logistics queue</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex space-x-2">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-tighter">Total: {packages.length}</div>
        </div>
    </div>
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
          <tr>
            <th className="px-8 py-5">Suite</th>
            <th className="px-8 py-5">Tracking</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {packages.map(pkg => (
            <tr key={pkg.id} className="hover:bg-slate-50/50 transition">
              <td className="px-8 py-6">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xs text-slate-600">
                      {pkg.suite.split('-')[1]}
                  </div>
              </td>
              <td className="px-8 py-6">
                  <p className="font-mono text-sm font-bold text-slate-900">{pkg.trackingNumber}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{pkg.merchant}</p>
              </td>
              <td className="px-8 py-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${pkg.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {pkg.status}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <select 
                  onChange={(e) => updateStatus(pkg.id, e.target.value)}
                  value={pkg.status}
                  className="p-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Auth & Profile Listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init failure:", err);
      }
    };
    initAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Real-time listener for user profile
        const profileRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...docSnap.data(), uid: u.uid });
          } else {
            setUser(null);
          }
          setLoading(false);
        }, (err) => {
            console.error("Profile sync error:", err);
            setLoading(false);
        });
        return () => unsubProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  // Package Data Sync - Filtered Logic
  useEffect(() => {
    if (!user) {
      setPackages([]);
      return;
    }

    const pkgQuery = collection(db, 'artifacts', appId, 'public', 'data', 'packages');
    const unsubPkgs = onSnapshot(pkgQuery, (snapshot) => {
      const allPkgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Strict Backend-style Filtering
      if (user.role === 'admin') {
        setPackages(allPkgs);
      } else {
        setPackages(allPkgs.filter(p => p.userId === user.uid));
      }
    });

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
        
        // Critical Rule 1 Paths
        await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), profileData);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', uid), { 
          name, suiteNumber: suite, uid 
        });

        // Backend Integration: Send Real Email via Gemini
        await sendVerificationEmail(email, name, suite);

        setPage('dashboard');
      } else {
        const userDoc = await getDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPage(userData.role === 'admin' ? 'admin-dashboard' : 'dashboard');
        } else {
            // Admin auto-provision for specific emails
            if (email.toLowerCase().includes('admin')) {
                const adminData = { name: 'Super Admin', email, role: 'admin', suiteNumber: 'ADMIN-X', isVerified: true };
                await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'data'), adminData);
                setPage('admin-dashboard');
            } else {
                alert("Account not found. Please register.");
                setPage('register');
            }
        }
      }
    } catch (error) {
      console.error("Auth Exception:", error);
      alert("Error processing request. Check connection.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerify = async () => {
      if (!user) return;
      setVerificationLoading(true);
      try {
          // Backend Logic: Activate account in Firestore
          const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
          await updateDoc(profileRef, { isVerified: true });
          // Note: Profile listener handles UI update automatically
      } catch (err) {
          console.error("Verification failed:", err);
      } finally {
          setVerificationLoading(false);
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

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <Package className="h-12 w-12 text-blue-500 animate-bounce mb-6" />
      <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm uppercase tracking-widest">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Authenticating Secure Session</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar user={user} setPage={setPage} logout={() => { signOut(auth); setPage('home'); }} />
      {user && user.role !== 'admin' && (
          <VerificationBanner 
            isVerified={user.isVerified} 
            onVerify={handleVerify} 
            loading={verificationLoading} 
          />
      )}
      
      <main className="pb-20">
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
      
      <footer className="bg-white border-t py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-50">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="font-bold tracking-tighter uppercase">{BRAND_NAME} COURIER</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">© 2025 Global Logistics Solutions. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
}

// --- SUB-PAGES ---
const AuthPage = ({ type, onAuth, setPage, isLoading }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {type === 'login' ? 'Welcome Back' : 'Create Suite'}
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Log in to manage your shipments.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onAuth({ email, name, type }); }} className="space-y-6">
          {type === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Name</label>
              <input 
                placeholder="John Doe" 
                required 
                className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-900" 
                onChange={e => setName(e.target.value)} 
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Access</label>
            <input 
              type="email" 
              placeholder="name@provider.com" 
              required 
              className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-900" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black text-lg hover:bg-blue-600 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-xl shadow-slate-100"
          >
            {isLoading ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : (type === 'login' ? 'Authorize Login' : 'Register Suite')}
          </button>
        </form>
        
        <button 
          disabled={isLoading}
          onClick={() => setPage(type === 'login' ? 'register' : 'login')} 
          className="w-full mt-10 text-xs text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest transition"
        >
          {type === 'login' ? "Need a suite? Register here" : 'Have a suite? Sign in'}
        </button>
      </div>
    </div>
  );
};