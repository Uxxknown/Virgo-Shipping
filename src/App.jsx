import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Settings,
  MessageSquare
} from 'lucide-react';

// --- CONFIG & CONSTANTS ---
const BRAND_NAME = "SwiftShip";
const WHATSAPP_NUMBER = "18761234567";

const PACKAGE_STATUSES = [
  'Expected',
  'Received',
  'In Transit',
  'Cleared',
  'Ready for Pickup',
  'Delivered'
];

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', duty: 0.20 },
  { id: 'clothing', name: 'Clothing', duty: 0.10 },
  { id: 'cosmetics', name: 'Cosmetics', duty: 0.15 },
  { id: 'parts', name: 'Auto Parts', duty: 0.25 },
  { id: 'general', name: 'General Merchandise', duty: 0.05 }
];

const INITIAL_RATES = {
  basePerLb: 4.50,
  processingFee: 5.00,
  insuranceRate: 0.015
};

const INITIAL_PACKAGES = [
  {
    id: 'pkg-1',
    userId: 'user-1',
    trackingNumber: '1Z999AA10123456784',
    merchant: 'Amazon',
    description: 'Noise Cancelling Headphones',
    valueUSD: 249.99,
    weightLb: 1.5,
    category: 'electronics',
    status: 'In Transit',
    createdAt: new Date().toISOString(),
    suite: 'SS-1001'
  }
];

// --- COMPONENTS ---

const Navbar = ({ user, setPage, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">{BRAND_NAME}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!user && (
                <>
                  <button onClick={() => setPage('rates')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Rates</button>
                  <button onClick={() => setPage('how-it-works')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">How It Works</button>
                  <button onClick={() => setPage('tracking')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Tracking</button>
                </>
              )}
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
          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="sm:hidden bg-white border-b px-2 pt-2 pb-3 space-y-1">
          <button onClick={() => {setPage('rates'); setIsOpen(false)}} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600">Rates</button>
          <button onClick={() => {setPage('how-it-works'); setIsOpen(false)}} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600">How It Works</button>
          {!user && (
             <button onClick={() => {setPage('login'); setIsOpen(false)}} className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600">Login</button>
          )}
        </div>
      )}
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
            <span className="text-blue-600">Ship to Your Door.</span>
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
            <button 
              onClick={() => setPage('tracking')}
              className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-blue-600 transition-all flex items-center justify-center"
            >
              Track Package <Search className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-blue-600 absolute -inset-4 rounded-3xl opacity-10 blur-xl"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=800&auto=format&fit=crop" 
              alt="Package delivery" 
              className="rounded-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose {BRAND_NAME}?</h2>
          <p className="text-slate-600 mt-4">We make international shipping simple and transparent.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-green-500" />, title: "Secure Handling", desc: "Every package is logged and tracked with high precision from arrival to delivery." },
            { icon: <Clock className="text-blue-500" />, title: "Rapid Delivery", desc: "Twice weekly shipments from Florida ensure you get your items in record time." },
            { icon: <DollarSign className="text-orange-500" />, title: "Competitive Rates", desc: "No hidden fees. Flat rates per pound with clear breakdowns for duties and taxes." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
              <div className="bg-white p-3 rounded-xl shadow-sm inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const TrackingPage = ({ searchTracking }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const pkg = searchTracking(query);
    setResult(pkg || 'not_found');
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Track Your Shipment</h2>
      <div className="flex gap-2 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Enter tracking or suite number" 
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700"
        >
          Track
        </button>
      </div>

      {result === 'not_found' && (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center border border-red-100">
          <AlertCircle className="mr-3" />
          No package found with that reference. Please check and try again.
        </div>
      )}

      {result && result !== 'not_found' && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div>
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Status</p>
              <h3 className="text-2xl font-bold text-blue-600">{result.status}</h3>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Last Updated</p>
              <p className="text-lg font-medium">{new Date(result.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {PACKAGE_STATUSES.map((status, idx) => {
              const currentIdx = PACKAGE_STATUSES.indexOf(result.status);
              const isPast = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={status} className="flex gap-4 relative">
                  {idx !== PACKAGE_STATUSES.length - 1 && (
                    <div className={`absolute left-3 top-6 w-0.5 h-10 ${idx < currentIdx ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                  )}
                  <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${isPast ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200'}`}>
                    {isPast && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className={`${isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AuthPage = ({ type, onAuth, setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth({ email, password, name, type });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 mt-2">
            {type === 'login' ? "Access your US address and dashboard" : "Get your personal US shipping address instantly"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition">
            {type === 'login' ? 'Sign In' : 'Register Now'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-600">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setPage(type === 'login' ? 'register' : 'login')}
            className="text-blue-600 font-bold hover:underline"
          >
            {type === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

const CustomerDashboard = ({ user, packages, onPreAlert, setPage }) => {
  const [showPreAlert, setShowPreAlert] = useState(false);
  
  const activePackages = packages.filter(p => p.status !== 'Delivered');
  const deliveredCount = packages.filter(p => p.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Hello, {user.name}!</h2>
            <p className="text-blue-100">Welcome to your shipping hub.</p>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Package className="h-10 w-10 text-white" />
              <div className="mt-2 text-2xl font-bold">{activePackages.length}</div>
              <div className="text-blue-100 text-xs uppercase tracking-wider">Active Shipments</div>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <CheckCircle2 className="h-10 w-10 text-white" />
              <div className="mt-2 text-2xl font-bold">{deliveredCount}</div>
              <div className="text-blue-100 text-xs uppercase tracking-wider">Total Delivered</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900">Your US Address</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
          </div>
          <div className="space-y-4 font-mono text-sm text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Name / Suite</p>
              <p className="font-bold text-slate-900">{user.name} / {user.suiteNumber}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Address Line 1</p>
              <p className="font-bold text-slate-900">8300 NW 123th Ave</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">City, State, Zip</p>
              <p className="font-bold text-slate-900">Miami, FL 33166</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Phone</p>
              <p className="font-bold text-slate-900">+1 (305) 555-0123</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold">My Shipments</h3>
          <button 
            onClick={() => setShowPreAlert(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Pre-Alert New Package
          </button>
        </div>

        {activePackages.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-slate-400 h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">No active packages</h4>
            <p className="text-slate-500">Add a pre-alert or ship to your US address to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tracking Number</th>
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activePackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pkg.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        pkg.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{pkg.trackingNumber}</td>
                    <td className="px-6 py-4 font-medium">{pkg.merchant}</td>
                    <td className="px-6 py-4">${pkg.valueUSD.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => { setPage('tracking'); }}
                        className="text-blue-600 font-bold text-sm hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPreAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">New Pre-Alert</h3>
              <button onClick={() => setShowPreAlert(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onPreAlert({
                trackingNumber: formData.get('tracking'),
                merchant: formData.get('merchant'),
                description: formData.get('desc'),
                valueUSD: parseFloat(formData.get('value') || '0'),
                category: formData.get('category'),
              });
              setShowPreAlert(false);
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tracking Number</label>
                  <input name="tracking" required placeholder="e.g. 1Z1234..." className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Merchant</label>
                  <input name="merchant" required placeholder="Amazon, eBay, etc." className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select name="category" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Declared Value (USD)</label>
                  <input type="number" name="value" step="0.01" required placeholder="0.00" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Upload Invoice</label>
                  <div className="w-full p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100">
                    <FileText className="h-5 w-5 mr-2" /> <span className="text-xs">Select File</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Description</label>
                  <textarea name="desc" placeholder="What is inside?" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                Save Pre-Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ packages, users, updatePackageStatus, rates, setRates }) => {
  const [activeTab, setActiveTab] = useState('packages');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6 px-4">Admin Management</h2>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'packages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Package className="h-5 w-5" /> Packages
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users className="h-5 w-5" /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('rates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'rates' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Settings className="h-5 w-5" /> Rates & Fees
          </button>
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          {activeTab === 'packages' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Manage Packages</h3>
                <div className="text-slate-500 text-sm">Total: {packages.length} items</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Suite #</th>
                      <th className="px-4 py-3">Merchant</th>
                      <th className="px-4 py-3">Tracking</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {packages.map(pkg => (
                      <tr key={pkg.id}>
                        <td className="px-4 py-4 font-bold text-blue-600">{pkg.suite}</td>
                        <td className="px-4 py-4">{pkg.merchant}</td>
                        <td className="px-4 py-4 font-mono text-xs">{pkg.trackingNumber}</td>
                        <td className="px-4 py-4">
                           <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{pkg.status}</span>
                        </td>
                        <td className="px-4 py-4">
                          <select 
                            onChange={(e) => updatePackageStatus(pkg.id, e.target.value)}
                            value={pkg.status}
                            className="text-sm p-1 border rounded"
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
          )}

          {activeTab === 'rates' && (
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6">Update Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Base Cost Per Lb (USD)</label>
                    <input 
                      type="number" 
                      value={rates.basePerLb} 
                      onChange={(e) => setRates({...rates, basePerLb: parseFloat(e.target.value)})}
                      className="w-full p-3 rounded-lg border border-slate-200"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Processing Fee (USD)</label>
                    <input 
                      type="number" 
                      value={rates.processingFee} 
                      onChange={(e) => setRates({...rates, processingFee: parseFloat(e.target.value)})}
                      className="w-full p-3 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="font-bold mb-4">Live Preview (Example: 2lb item)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Weight Fee (2 x ${rates.basePerLb})</span>
                      <span>${(2 * rates.basePerLb).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing</span>
                      <span>${rates.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total</span>
                      <span>${(2 * rates.basePerLb + rates.processingFee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="p-6">
               <h3 className="text-xl font-bold mb-6">Customer Base</h3>
               <div className="space-y-4">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-slate-700">{u.suiteNumber}</p>
                        <p className="text-[10px] text-slate-400 uppercase">Suite ID</p>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [users, setUsers] = useState([
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'customer', suiteNumber: 'SS-1001' },
    { id: 'admin-1', name: 'Admin User', email: 'admin@swiftship.com', role: 'admin', suiteNumber: 'ADMIN' }
  ]);
  const [rates, setRates] = useState(INITIAL_RATES);

  const handleAuth = ({ email, name, type }) => {
    if (type === 'login') {
      const found = users.find(u => u.email === email);
      if (found) {
        setUser(found);
        setPage(found.role === 'admin' ? 'admin-dashboard' : 'dashboard');
      } else {
        alert("Invalid credentials");
      }
    } else {
      const newSuite = `SS-${1000 + users.length + 1}`;
      const newUser = { id: `user-${Date.now()}`, name, email, role: 'customer', suiteNumber: newSuite };
      setUsers([...users, newUser]);
      setUser(newUser);
      setPage('dashboard');
    }
  };

  const handlePreAlert = (data) => {
    const newPackage = {
      ...data,
      id: `pkg-${Date.now()}`,
      userId: user.id,
      suite: user.suiteNumber,
      status: 'Expected',
      createdAt: new Date().toISOString()
    };
    setPackages([newPackage, ...packages]);
  };

  const updatePackageStatus = (id, newStatus) => {
    setPackages(packages.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const searchTracking = (query) => {
    return packages.find(p => p.trackingNumber.toLowerCase() === query.toLowerCase() || p.id === query);
  };

  const logout = () => {
    setUser(null);
    setPage('home');
  };

  const renderContent = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'tracking': return <TrackingPage searchTracking={searchTracking} />;
      case 'login': return <AuthPage type="login" onAuth={handleAuth} setPage={setPage} />;
      case 'register': return <AuthPage type="register" onAuth={handleAuth} setPage={setPage} />;
      case 'dashboard': return <CustomerDashboard user={user} packages={packages.filter(p => p.userId === user?.id)} onPreAlert={handlePreAlert} setPage={setPage} />;
      case 'admin-dashboard': return <AdminPanel packages={packages} users={users.filter(u => u.role !== 'admin')} updatePackageStatus={updatePackageStatus} rates={rates} setRates={setRates} />;
      case 'rates': return (
        <div className="max-w-4xl mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Shipping Rates</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-xs font-bold">Recommended</div>
               <h3 className="text-xl font-bold mb-4">Standard Express</h3>
               <div className="flex items-baseline mb-6">
                 <span className="text-4xl font-extrabold">${rates.basePerLb.toFixed(2)}</span>
                 <span className="text-slate-500 ml-2">/ lb</span>
               </div>
               <ul className="space-y-3 mb-8 text-slate-600">
                 <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" /> Twice weekly shipping</li>
                 <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" /> Customs clearance included</li>
                 <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" /> 2-3 business days</li>
               </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
               <h3 className="text-xl font-bold mb-4">Fees & Duties</h3>
               <div className="space-y-4">
                 <div className="flex justify-between border-b pb-2">
                   <span>Processing Fee</span>
                   <span className="font-bold">${rates.processingFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                   <span>Insurance</span>
                   <span className="font-bold">{(rates.insuranceRate * 100).toFixed(1)}%</span>
                 </div>
                 <div className="text-sm text-slate-500 italic mt-4">
                   *Duties are calculated based on item category and declared value.
                 </div>
               </div>
            </div>
          </div>
        </div>
      );
      case 'how-it-works': return (
        <div className="max-w-5xl mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-slate-600">Sign up and get your personal US shipping address instantly.</p>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Shop</h3>
              <p className="text-slate-600">Use your US address at checkout on any website like Amazon or eBay.</p>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Receive</h3>
              <p className="text-slate-600">We ship your items to your local doorstep or pickup location.</p>
            </div>
          </div>
        </div>
      );
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar user={user} setPage={setPage} logout={logout} />
      
      <main className="min-h-[calc(100vh-64px)]">
        {renderContent()}
      </main>

      <footer className="bg-white border-t py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold">{BRAND_NAME}</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              The bridge between you and the global marketplace. Premium logistics services with a personal touch.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li>About Us</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li>Help Center</li>
              <li>FAQ</li>
              <li className="flex items-center"><Clock className="h-4 w-4 mr-2" /> 9am - 5pm</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </footer>

      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold">Chat with us</span>
      </a>
    </div>
  );
}