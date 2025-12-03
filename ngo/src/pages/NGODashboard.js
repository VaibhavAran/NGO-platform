import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function NGODashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 📋 Sample Data
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "Amit Sharma", age: 25, contact: "9876543210", role: "Field Volunteer" },
    { id: 2, name: "Priya Patel", age: 28, contact: "9876123450", role: "Event Coordinator" },
    { id: 3, name: "Ravi Kumar", age: 30, contact: "9898123456", role: "Medical Support" },
    { id: 4, name: "Sneha Desai", age: 27, contact: "9898000112", role: "Education Assistant" },
    { id: 5, name: "Arjun Mehta", age: 26, contact: "9822001122", role: "Logistics" },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: "Food Drive", date: "2025-11-15", location: "Pune", attendees: 120 },
    { id: 2, title: "Blood Donation Camp", date: "2025-11-25", location: "Mumbai", attendees: 80 },
    { id: 3, title: "Tree Plantation", date: "2025-12-01", location: "Nashik", attendees: 200 },
    { id: 4, title: "Cloth Donation", date: "2025-12-05", location: "Nagpur", attendees: 150 },
    { id: 5, title: "Health Checkup Camp", date: "2025-12-10", location: "Kolhapur", attendees: 100 },
  ]);

  const [donations, setDonations] = useState([
    { id: 1, donor: "Rahul Verma", amount: 5000, method: "Online", date: "2025-11-08" },
    { id: 2, donor: "Anita Deshmukh", amount: 3000, method: "UPI", date: "2025-11-07" },
    { id: 3, donor: "Vikram Singh", amount: 7000, method: "Cash", date: "2025-11-05" },
    { id: 4, donor: "Neha Joshi", amount: 2500, method: "Bank Transfer", date: "2025-11-03" },
    { id: 5, donor: "Rohit Patil", amount: 10000, method: "Cheque", date: "2025-11-02" },
  ]);


// NEW: Replace with this
const [helpRequests, setHelpRequests] = useState([]);
const [requestsLoading, setRequestsLoading] = useState(false);

  const [reports, setReports] = useState([
    { id: 1, title: "Monthly Donation Report", total: "₹27,500", date: "Nov 2025" },
    { id: 2, title: "Volunteer Activity Summary", total: "250 Active Volunteers", date: "Nov 2025" },
    { id: 3, title: "Event Participation", total: "650 Participants", date: "Nov 2025" },
    { id: 4, title: "Help Requests Resolved", total: "18 Resolved", date: "Nov 2025" },
    { id: 5, title: "Funding Utilization", total: "82% of donations used effectively", date: "Nov 2025" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "ngos", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setError("NGO profile not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch requests from Firestore
useEffect(() => {
  const fetchRequests = async () => {
    if (!auth.currentUser) {
      console.log("⚠️ No auth user, skipping request fetch");
      return;
    }

    const ngoId = auth.currentUser.uid; // 👈 should be u4RA8HMQV4TpIStDLE5Edv6rRi52
    console.log("🔍 Fetching requests for NGO ID:", ngoId);

    setRequestsLoading(true);
    try {
      const q = query(
        collection(db, "requests"),
        where("ngoId", "==", ngoId)   // 👈 sirf yeh filter
      );

      const snap = await getDocs(q);
      console.log("📥 Requests found for this NGO:", snap.size);

      const requestsData = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        console.log("📄 Request doc:", docSnap.id, data);

        const dateObj = data.date ? data.date.toDate() : null;

        return {
          id: docSnap.id,
          title: data.title || "",
          description: data.description || "",
          ngoId: data.ngoId || "",
          ngoName: data.ngoName || "",
          userId: data.userId || "",
          attachments: data.attachments || [],
          status: data.status || "pending",
          statusLabel:
            data.status === "pending"
              ? "Pending"
              : data.status === "accepted"
              ? "Accepted ✅"
              : data.status === "rejected"
              ? "Rejected ❌"
              : data.status?.toString(),
          dateObj,
          dateText: dateObj ? dateObj.toLocaleDateString() : "N/A",
        };
      });

      // 🔹 Client-side sort (newest first)
      requestsData.sort((a, b) => {
        if (!a.dateObj) return 1;
        if (!b.dateObj) return -1;
        return b.dateObj - a.dateObj;
      });

      setHelpRequests(requestsData);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  fetchRequests();
}, [profile]);  // same dependency rakho
// 👈 Empty dependency: run once on mount



  // 🧩 Tab configuration
  const tabs = [
    { key: "dashboard", label: "🏠 Dashboard" },
    { key: "volunteers", label: "🤝 Volunteers" },
    { key: "events", label: "📅 Events" },
    { key: "donations", label: "💰 Donations" },
    { key: "requests", label: "📨 Help Requests" },
    { key: "reports", label: "📊 Reports" },
    { key: "profile", label: "👤 Profile" },
  ];
const handleAccept = async (id) => {
  try {
    const docRef = doc(db, "requests", id);
    await updateDoc(docRef, { status: "accepted" });

    setHelpRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "accepted", statusLabel: "Accepted ✅" } : r
      )
    );
    alert("Request accepted!");
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to accept request.");
  }
};

const handleReject = async (id) => {
  try {
    const docRef = doc(db, "requests", id);
    await updateDoc(docRef, { status: "rejected" });

    setHelpRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected", statusLabel: "Rejected ❌" } : r
      )
    );
    alert("Request rejected.");
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to reject request.");
  }
};

const handleProvideSolution = async (id) => {
  const solution = prompt("Enter solution:");
  if (!solution) return;

  try {
    const docRef = doc(db, "requests", id);
    await updateDoc(docRef, { status: `resolved: ${solution}` });

    setHelpRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: `resolved: ${solution}`,
              statusLabel: `Resolved: ${solution}`,
            }
          : r
      )
    );
    alert("Solution provided!");
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to provide solution.");
  }
};


  // 🚫 NO Firestore for these, only local state
  const handleAddVolunteer = (volunteerData) => {
    setVolunteers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...volunteerData,
      },
    ]);
  };

  const handleAddEvent = (eventData) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...eventData,
      },
    ]);
  };

  const handleAddDonation = (donationData) => {
    setDonations((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...donationData,
      },
    ]);
  };

  const handleAddReport = () => {
    const title = prompt("Enter Report Title:");
    const total = prompt("Enter Summary Value (e.g., ₹10,000 or 25 Resolved):");
    const date = prompt("Enter Period (e.g., Nov 2025):");
    if (!title || !total || !date) return;
    setReports((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        total,
        date,
      },
    ]);
  };

  const handleEditProfile = async () => {
    if (!profile) return;
    const field = prompt(
      "Which field would you like to edit? (name, email, phone, address, city, state, registrationNumber, establishedYear, website, description, services, workingAreas)"
    );
    if (!field || !(field in profile)) return alert("Invalid field.");
    const value = prompt(`Enter new value for ${field}:`, profile[field]);
    if (value) {
      try {
        const docRef = doc(db, "ngos", auth.currentUser.uid);
        await updateDoc(docRef, { [field]: value });
        setProfile({ ...profile, [field]: value });
        alert("Profile updated successfully!");
      } catch (err) {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      }
    }
  };

  const stats = [
    { title: "Volunteers", count: volunteers.length },
    { title: "Events", count: events.length },
    { title: "Donations", count: donations.length },
    { title: "Help Requests", count: helpRequests.length },
  ];

 const latestRequests = helpRequests.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-gray-600">Loading NGO Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    profile?.name && profile.name.includes("_")
      ? profile.name.split("_")[1]
      : profile?.name || "NGO";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-teal-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-teal-700 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">🌍 NGO Panel</h2>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-2 mb-2 rounded text-left transition ${
              activeTab === tab.key ? "bg-teal-500 text-white" : "hover:bg-blue-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded text-center font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-blue-800">
              Welcome, {displayName} 👋
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your NGO activities efficiently with this all-in-one panel.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl shadow-md border-t-4 border-teal-500 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-700">{s.title}</h3>
                  <p className="text-4xl font-bold text-teal-600 mt-2">{s.count}</p>
                </div>
              ))}
            </div>

            {/* Latest Help Requests */}
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">
              📬 Latest Help Requests
            </h2>
            <ul className="bg-white rounded-xl shadow divide-y border">
              {latestRequests.map((req) => (
  <li key={req.id} className="p-4">
    <strong className="text-gray-800">{req.title}</strong> — {req.description}
    <div className="text-sm text-gray-500">
      Date: {req.dateText} | {req.statusLabel}
    </div>
  </li>
))}

            </ul>
          </div>
        )}

        {/* Volunteers */}
        {activeTab === "volunteers" && (
          <VolunteersSection volunteers={volunteers} onAdd={handleAddVolunteer} />
        )}

        {/* Events */}
        {activeTab === "events" && (
          <EventsSection events={events} onAdd={handleAddEvent} />
        )}

        {/* Donations */}
        {activeTab === "donations" && (
          <DonationsSection donations={donations} onAdd={handleAddDonation} />
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <EnhancedSection title="📊 Reports / Analytics" data={reports} onAdd={handleAddReport} />
        )}

        {/* Help Requests */}
        {activeTab === "requests" && (
  <RequestsSection
    requests={helpRequests}
    loading={requestsLoading}
    onAccept={handleAccept}
    onReject={handleReject}
    onSolve={handleProvideSolution}
  />
)}


        {/* Profile */}
        {activeTab === "profile" && (
          <ProfileSection profile={profile} onEdit={handleEditProfile} />
        )}
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

const VolunteersSection = ({ volunteers, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    contact: "",
    role: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.role) {
      alert("Please fill Name, Contact and Role.");
      return;
    }
    onAdd({
      name: form.name.trim(),
      age: form.age ? Number(form.age) : "",
      contact: form.contact.trim(),
      role: form.role.trim(),
    });
    setForm({ name: "", age: "", contact: "", role: "" });
    setShowForm(false); // hide form after submit
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">🤝 Volunteers</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "✖ Close Form" : "➕ Add Volunteer"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto mb-6">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v) => (
              <tr key={v.id} className="hover:bg-gray-100 border-b">
                <td className="p-2 text-gray-700">{v.id}</td>
                <td className="p-2 text-gray-700">{v.name}</td>
                <td className="p-2 text-gray-700">{v.age}</td>
                <td className="p-2 text-gray-700">{v.contact}</td>
                <td className="p-2 text-gray-700">{v.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form – only visible when Add is clicked */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">
            ➕ Add New Volunteer
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number *"
              value={form.contact}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="role"
              placeholder="Role * (e.g., Field Volunteer)"
              value={form.role}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
              >
                Save Volunteer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


const EventsSection = ({ events, onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    attendees: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      alert("Please fill Title, Date and Location.");
      return;
    }
    onAdd({
      title: form.title.trim(),
      date: form.date,
      location: form.location.trim(),
      attendees: form.attendees ? Number(form.attendees) : 0,
    });
    setForm({ title: "", date: "", location: "", attendees: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">📅 Events</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "✖ Close Form" : "➕ Add Event"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto mb-6">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Location</th>
              <th className="p-2">Attendees</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-100 border-b">
                <td className="p-2 text-gray-700">{ev.id}</td>
                <td className="p-2 text-gray-700">{ev.title}</td>
                <td className="p-2 text-gray-700">{ev.date}</td>
                <td className="p-2 text-gray-700">{ev.location}</td>
                <td className="p-2 text-gray-700">{ev.attendees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form – only when Add clicked */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">
            ➕ Add New Event
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Event Title *"
              value={form.title}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="location"
              placeholder="Location *"
              value={form.location}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="number"
              name="attendees"
              placeholder="Expected Attendees"
              value={form.attendees}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


const DonationsSection = ({ donations, onAdd }) => {
  const [form, setForm] = useState({
    donor: "",
    amount: "",
    method: "",
    date: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.donor || !form.amount || !form.method) {
      alert("Please fill Donor, Amount and Method.");
      return;
    }
    onAdd({
      donor: form.donor.trim(),
      amount: Number(form.amount),
      method: form.method.trim(),
      date: form.date || new Date().toISOString().slice(0, 10),
    });
    setForm({ donor: "", amount: "", method: "", date: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">💰 Donations</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "✖ Close Form" : "➕ Add Donation"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto mb-6">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Donor</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Method</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-gray-100 border-b">
                <td className="p-2 text-gray-700">{d.id}</td>
                <td className="p-2 text-gray-700">{d.donor}</td>
                <td className="p-2 text-gray-700">₹{d.amount}</td>
                <td className="p-2 text-gray-700">{d.method}</td>
                <td className="p-2 text-gray-700">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form – only when Add clicked */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">
            ➕ Add New Donation
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="donor"
              placeholder="Donor Name *"
              value={form.donor}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount (₹) *"
              value={form.amount}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Select Method *</option>
              <option value="Online">Online</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
              >
                Save Donation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


const EnhancedSection = ({ title, data, onAdd }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-blue-800">{title}</h1>
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add
        </button>
      )}
    </div>
    <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
      <table className="min-w-full text-left border">
        <thead>
          <tr className="bg-teal-600 text-white">
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key} className="p-2 capitalize">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100 border-b">
              {Object.values(row).map((val, j) => (
                <td key={j} className="p-2 text-gray-700">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RequestsSection = ({ requests, onAccept, onReject, onSolve, loading }) => {
  const [selected, setSelected] = useState(null);

  const renderRowActions = (r) => {
    const status = (r.status || "").toLowerCase();
    const isPending = status === "pending";
    const isAccepted = status === "accepted";
    const isRejected = status === "rejected";
    const isResolved = status.startsWith("resolved");

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {/* View always */}
        <button
          onClick={() => setSelected(r)}
          className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          View
        </button>

        {/* Pending: Accept / Reject / Solve */}
        {isPending && (
          <>
            <button
              onClick={() => onAccept(r.id)}
              className="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(r.id)}
              className="px-3 py-1 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => onSolve(r.id)}
              className="px-3 py-1 text-xs rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Solve
            </button>
          </>
        )}

        {/* Accepted: Reject + Solve */}
        {isAccepted && (
          <>
            <button
              onClick={() => onReject(r.id)}
              className="px-3 py-1 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => onSolve(r.id)}
              className="px-3 py-1 text-xs rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Solve
            </button>
          </>
        )}

        {/* Rejected: only Accept (if you want to re-open) */}
        {isRejected && (
          <button
            onClick={() => onAccept(r.id)}
            className="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            Accept
          </button>
        )}

        {/* Resolved: no extra actions, sirf View */}
        {isResolved && null}
      </div>
    );
  };

  const renderModalActions = (selected) => {
    if (!selected) return null;

    const status = (selected.status || "").toLowerCase();
    const isPending = status === "pending";
    const isAccepted = status === "accepted";
    const isRejected = status === "rejected";
    const isResolved = status.startsWith("resolved");

    return (
      <div className="mt-5 flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => setSelected(null)}
          className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          Close
        </button>

        {isPending && (
          <>
            <button
              onClick={() => {
                onAccept(selected.id);
                setSelected(null);
              }}
              className="px-4 py-2 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => {
                onReject(selected.id);
                setSelected(null);
              }}
              className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => {
                onSolve(selected.id);
                // keep modal open if you want
              }}
              className="px-4 py-2 text-sm rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Solve
            </button>
          </>
        )}

        {isAccepted && (
          <>
            <button
              onClick={() => {
                onReject(selected.id);
                setSelected(null);
              }}
              className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => {
                onSolve(selected.id);
              }}
              className="px-4 py-2 text-sm rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Solve
            </button>
          </>
        )}

        {isRejected && (
          <button
            onClick={() => {
              onAccept(selected.id);
              setSelected(null);
            }}
            className="px-4 py-2 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            Accept
          </button>
        )}

        {/* Resolved → sirf Close button upar hai */}
      </div>
    );
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">📨 Help Requests</h1>

      {loading && <p className="mb-3 text-gray-500">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="mb-3 text-gray-500">No requests received yet.</p>
      )}

      {requests.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto mb-6">
          <table className="min-w-full text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-teal-600 text-white text-sm">
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Attachments</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, idx) => (
                <tr
                  key={r.id}
                  className={
                    "text-sm " +
                    (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                    " hover:bg-blue-50 transition-colors"
                  }
                >
                  <td className="p-3 font-semibold text-gray-800 max-w-xs truncate">
                    {r.title}
                  </td>
                  <td className="p-3 text-gray-700">{r.dateText}</td>
                  <td className="p-3 text-gray-700">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {r.statusLabel}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.attachments && r.attachments.length > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {r.attachments.length} file(s)
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    {renderRowActions(r)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Popup for details */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg leading-none"
            >
              ✕
            </button>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-blue-800 mb-1">
                {selected.title}
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                {selected.dateText} • {selected.statusLabel}
              </p>

              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>NGO:</strong> {selected.ngoName || "N/A"}
                </p>
                <p>
                  <strong>User ID:</strong>{" "}
                  <span className="text-xs break-all">
                    {selected.userId || "N/A"}
                  </span>
                </p>
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 text-gray-800 text-sm max-h-52 overflow-auto">
                    {selected.description}
                  </p>
                </div>

                <div>
                  <strong>Attachments:</strong>
                  {selected.attachments && selected.attachments.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {selected.attachments.map((file, idx) => (
                        <li key={idx} className="text-xs text-gray-700">
                          {file.name}{" "}
                          {file.size && (
                            <span className="text-gray-400">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">
                      No attachments
                    </p>
                  )}
                </div>
              </div>

              {renderModalActions(selected)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




const ProfileSection = ({ profile, onEdit }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-blue-800">👤 NGO Profile</h1>
      <button
        onClick={onEdit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        ✏️ Edit
      </button>
    </div>
    {profile ? (
      <ul className="space-y-2 text-gray-700">
        <li>
          <strong>Name:</strong> {profile.name}
        </li>
        <li>
          <strong>Email:</strong> {profile.email}
        </li>
        <li>
          <strong>Phone:</strong> {profile.phone}
        </li>
        <li>
          <strong>Address:</strong> {profile.address}
        </li>
        <li>
          <strong>City:</strong> {profile.city}
        </li>
        <li>
          <strong>State:</strong> {profile.state}
        </li>
        <li>
          <strong>Registration Number:</strong> {profile.registrationNumber}
        </li>
        <li>
          <strong>Established Year:</strong> {profile.establishedYear}
        </li>
        <li>
          <strong>Website:</strong> {profile.website || "N/A"}
        </li>
        <li>
          <strong>Description:</strong> {profile.description}
        </li>
        <li>
          <strong>Services:</strong> {profile.services?.join(", ") || "N/A"}
        </li>
        <li>
          <strong>Working Areas:</strong> {profile.workingAreas?.join(", ") || "N/A"}
        </li>
      </ul>
    ) : (
      <p className="text-gray-500">Loading profile...</p>
    )}
  </div>
);

