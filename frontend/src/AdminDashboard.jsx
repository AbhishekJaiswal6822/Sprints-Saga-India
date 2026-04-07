// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\AdminDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import for Excel support
import {
  FiUsers, FiDownload, FiSearch, FiActivity, FiHeart, FiAward,
  FiTrendingUp, FiGrid, FiClock, FiXCircle, FiCheckCircle,
  FiAlertCircle, FiX, FiEye, FiInfo, FiExternalLink, FiMapPin, FiCreditCard, FiRotateCcw,
  FiTag, FiPlus, FiTrash2, FiZap
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList
} from 'recharts';

function AdminDashboard() {
  // --- MOVE THESE 3 LINES HERE (Line 13) ---
  const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.sprintssagaindia.com";




  // demographics 
  const [demoMetric, setDemoMetric] = useState("category"); // default view
  const [insightTab, setInsightTab] = useState("coupons"); // to switch between analytics types
  const [data, setData] = useState({ users: [], registrations: [], stats: {} });


  const normalizeCategory = (cat) => {
    if (!cat) return "N/A";

    // Standardize string for internal counting only
    const raw = cat.toString().toLowerCase().trim().replace(/\s+/g, " ");

    // Race category normalization
    if (raw === "5k" || raw === "5 km" || raw === "5km" || raw === "5 k" || raw.includes("5k fun run") || raw.includes("5km")) return "5k";
    if (raw === "10k" || raw === "10 km" || raw === "10km" || raw === "10 k" || raw.includes("10k challenge") || raw.includes("10km")) return "10k";
    if (raw === "21k" || raw === "21 km" || raw === "21km" || raw.includes("21.097") || raw.includes("half marathon") || raw === "half" || raw.includes("21k")) return "21k";
    if (raw === "35k" || raw === "35 km" || raw === "35km" || raw.includes("35k ultra")) return "35k";
    if (raw === "42k" || raw === "42 km" || raw === "42km" || raw.includes("full marathon") || raw === "full" || raw === "42.195") return "42k";

    // If it doesn't match any known category, return as-is for debugging
    return cat;
  };
  const [regFilter, setRegFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all"); // New gender filter for demographics
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const [couponData, setCouponData] = useState({ code: '', discountType: 'PERCENT', discountValue: 0 });
  const [coupons, setCoupons] = useState([]); // To list existing coupons
  const [couponLoading, setCouponLoading] = useState(false);

  // revenue analytics 
  const [revMetric, setRevMetric] = useState("category"); // options: "category", "gender"
  const revenueBarRef = useRef(null);
  const revenuePieRef = useRef(null);
  const [revGenderFilter, setRevGenderFilter] = useState("all");

  const revenueAnalyticsData = useMemo(() => {
    // Always initialize the 5 standard race categories
    const stats = { "5k": 0, "10k": 0, "21k": 0, "35k": 0, "42k": 0 };

    (data.registrations || []).forEach(r => {
      // Only process PAID registrations
      if (r.paymentStatus === 'paid') {
        const amount = Number(r.amount) || 0;
        const category = normalizeCategory(r.raceCategory || r.displayDetails?.raceCategory);

        // Get gender and clean it for strict comparison
        const rawGender = (r.displayDetails?.gender || r.runnerDetails?.gender || "").toString().toLowerCase().trim();

        let shouldCount = false;

        // 1. Logic for "Race Category Revenue" tab (Shows total for everyone)
        if (revMetric === "category") {
          shouldCount = true;
        }
        // 2. Logic for "Gender Revenue" tab (Filters by the selected button)
        else if (revMetric === "gender") {
          if (revGenderFilter === "all") {
            shouldCount = true;
          } else if (revGenderFilter === "male") {
            if (rawGender === "male") shouldCount = true;
          } else if (revGenderFilter === "female") {
            if (rawGender === "female") shouldCount = true;
          } else if (revGenderFilter === "other") {
            // Strictly count only if it's NOT male and NOT female
            if (rawGender !== "male" && rawGender !== "female" && rawGender !== "") {
              shouldCount = true;
            }
          }
        }

        // Add to category bucket if it passed the filters above
        if (shouldCount && stats[category] !== undefined) {
          stats[category] += amount;
        }
      }
    });

    // Format for the charts
    return Object.entries(stats).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  }, [data.registrations, revMetric, revGenderFilter]);

  // NEW STATE: Specific search for coupons to avoid interfering with global search
  const [couponSearch, setCouponSearch] = useState("");

  // Chart data for Data Insights
  const COLORS = ['#0d9488', '#0ea5e9', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#f97316', '#06b6d4', '#a855f7', '#ef4444', '#2dd4bf', '#fbbf24', '#fb7185', '#818cf8', '#c084fc', '#4ade80', '#fb923c', '#22d3ee'];
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const couponBarChartRef = useRef(null);
  const couponPieChartRef = useRef(null);
  const [barMetric, setBarMetric] = useState("revenue"); // options: "revenue" or "uses"
  // --- DATA PROCESSING FOR INSIGHTS ---
  const couponChartData = useMemo(() => {
    const stats = {};
    (data.registrations || []).forEach(r => {
      // Only process if a valid coupon code exists (skips N/A, -, and empty values)
      if (r.couponCode && r.couponCode !== "N/A" && r.couponCode !== "-" && r.paymentStatus === 'paid') {
        if (!stats[r.couponCode]) {
          stats[r.couponCode] = { name: r.couponCode, uses: 0, discount: 0, revenue: 0 };
        }
        stats[r.couponCode].uses += 1;
        stats[r.couponCode].discount += (Number(r.discountAmount) || 0);
        stats[r.couponCode].revenue += (Number(r.amount) || 0);
      }
    });

    // Converting to array and sorting by revenue
    return Object.values(stats).sort((a, b) => b.revenue - a.revenue);
  }, [data.registrations]);

  // 1. Fetch coupons list
  const fetchCoupons = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setCoupons(res.data.data);
    } catch (err) { console.error("Fetch Coupons Error:", err.message); }
  }, [API_BASE_URL]);

  // 2. Toggle Status
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE_URL}/api/coupons/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons(); // Refresh list
    } catch { alert("Failed to toggle status"); }
  };

  // 3. Delete Coupon
  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons(); // Refresh list
    } catch { alert("Failed to delete coupon"); }
  };

  // 4. Update useEffect to fetch coupons when tab changes
  useEffect(() => {
    if (activeTab === "coupons") fetchCoupons();
  }, [activeTab, fetchCoupons]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // If there is no token, don't even try to fetch; redirect to login
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
        const API_BASE_URL = window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : PROD_BACKEND_URL;

        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err.message);
        // If the server says 401, the token is expired/invalid. Redirect to login.
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    const raw = dateObj.$date || dateObj;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "N/A";

    // Since we saved at 12:00 PM, these will ALWAYS return the correct Day/Month
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (year === 1900) return "N/A";
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";

    // Handle both standard Date strings and MongoDB $date objects
    const raw = dob.$date || dob;
    const birthDate = new Date(raw);

    if (isNaN(birthDate.getTime())) return "N/A";

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If current month is before birth month, OR 
    // if it's the birth month but today's date is before the birth date:
    // The person hasn't reached their birthday yet this year.
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Safety check for invalid future dates or very old placeholder dates (like 1900)
    if (age < 0 || birthDate.getFullYear() === 1900) return "N/A";

    return age.toString();
  };

  const resetFilters = () => {
    setRegFilter("all");
    setCatFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  /**
   * Handles the creation of a new discount coupon.
   * Triggered by the "Generate Coupon" form in the Admin Panel.
   */
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    try {
      const token = localStorage.getItem("token");
      const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
      const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8000" : PROD_BACKEND_URL;

      const res = await axios.post(`${API_BASE_URL}/api/coupons`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Coupon Generated Successfully!");
        setCouponData({ code: '', discountType: 'PERCENT', discountValue: 0 });
        fetchCoupons(); // refresh the list
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to create coupon"));
    } finally {
      setCouponLoading(false);
    }
  };

  // --- FILTERED USERS ---
  const filteredUsers = (data.users || []).filter(u => {
    const s = searchTerm.toLowerCase();
    const joinDate = formatDate(u.createdAt).toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u._id?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s) ||
      joinDate.includes(s)
    );
  });

  const regs = data.registrations || [];

  // TRANSFORM DATA: Flatten Group Members into individual rows for the Admin Panel
  const tableRows = regs.flatMap((r) => {
    if (r.registrationType === 'group' && r.groupMembers && r.groupMembers.length > 0) {
      return r.groupMembers.map((member, index) => ({
        ...r,
        displayDetails: member,
        isGroupMember: true,
        memberPosLabel: `Member ${index + 1}`,
        rowId: `${r._id}-${index}`
      }));
    }
    return [{
      ...r,
      displayDetails: r.runnerDetails,
      isGroupMember: false,
      memberPosLabel: "Individual",
      rowId: r._id
    }];
  });

  // --- FILTERED REGISTRATIONS ---
  const filteredRegistrations = tableRows.filter((r) => {
    const matchesType = regFilter === "all" || r.registrationType === regFilter;

    // Normalize race category once for accurate standard comparison
    const normalizedRaceCategory = normalizeCategory(r.displayDetails?.raceCategory || r.raceCategory || "N/A").toLowerCase();

    const matchesCategory = catFilter === "all" || normalizedRaceCategory === catFilter;

    const matchesStatus = statusFilter === "all" || r.paymentStatus === statusFilter;
    const s = searchTerm.toLowerCase();
    if (!s) return matchesType && matchesCategory && matchesStatus;

    const searchBlob = [
      r.displayDetails?.firstName, r.displayDetails?.lastName, r.displayDetails?.email,
      r.displayDetails?.phone, r.displayDetails?.whatsapp, r.displayDetails?.gender,
      r.displayDetails?.bloodGroup, r.displayDetails?.nationality, r.displayDetails?.address,
      r.displayDetails?.city, r.displayDetails?.state, r.displayDetails?.pincode,
      r.displayDetails?.country, r.displayDetails?.experience, r.displayDetails?.finishTime,
      r.displayDetails?.dietary, r.displayDetails?.tshirtSize, r.displayDetails?.parentName,
      r.displayDetails?.parentPhone, r.registrationType,
      r.displayDetails?.raceCategory,
      r.raceCategory,
      r.groupName,
      r.paymentStatus, r.paymentDetails?.paymentId, r.paymentDetails?.orderId,
      r.idProof?.idNumber, r.idProof?.idType, r.amount?.toString(), (r.displayDetails?.dob ? formatDate(r.displayDetails.dob) : "")
    ].join(" ").toLowerCase();

    return matchesType && matchesCategory && matchesStatus && searchBlob.includes(s);
  });

  // NEW: Filtered Coupons for the dedicated Coupon Search

  // NEW: Filtered Coupons for the dedicated Coupon Search
  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const demographicData = useMemo(() => {
    // Initialize standard buckets with 0
    const stats = { "5k": 0, "10k": 0, "21k": 0, "35k": 0, "42k": 0 };

    // We loop through tableRows (flattened individuals) - COUNT ONLY PAID RUNNERS
    tableRows.forEach(r => {
      // Only count paid runners for demographics
      if (r.paymentStatus !== 'paid') return;

      // Apply gender filter to demographics data
      if (genderFilter !== 'all') {
        const rawGender = (r.displayDetails?.gender || r.gender || 'Not Specified').toString().toLowerCase().trim();
        if (genderFilter === 'male' && rawGender !== 'male') return;
        if (genderFilter === 'female' && rawGender !== 'female') return;
        if (genderFilter === 'other' && (rawGender === 'male' || rawGender === 'female')) return;
      }

      let key = "";

      if (demoMetric === "category") {
        // Use displayDetails as primary source (matches rest of the file)
        key = normalizeCategory(r.displayDetails?.raceCategory || r.raceCategory);
        // Only count if it's one of our standard categories
        if (!["5k", "10k", "21k", "35k", "42k"].includes(key)) {
          return; // Skip this registration for category counting
        }
      } else if (demoMetric === "gender") {
        key = r.displayDetails?.gender || "Not Specified";
      } else if (demoMetric === "tshirt") {
        key = r.displayDetails?.tshirtSize || "N/A";
      } else if (demoMetric === "city") {
        key = r.displayDetails?.city || "Other";
      }

      // Increment if it matches our standard categories
      if (stats[key] !== undefined) {
        stats[key] += 1;
      } else if (demoMetric !== "category" && key) {
        // For dynamic keys like City/Gender
        stats[key] = (stats[key] || 0) + 1;
      }
    });

    if (demoMetric === "category") {
      // Return exactly the 5 categories in the correct order, but only if value > 0
      return ["5k", "10k", "21k", "35k", "42k"].map(cat => ({
        name: cat,
        value: stats[cat]
      })).filter(item => item.value > 0);
    }

    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [tableRows, demoMetric, genderFilter]);

  // --- DYNAMIC STATS BASED ON CURRENT TAB ---
  const dynamicStats = (() => {
    if (activeTab === "users") {
      return {
        "Total Users": filteredUsers.length,
        "Search Matches": filteredUsers.length
      };
    } else if (activeTab === "coupons") {
      return {
        "Total Coupons": coupons.length,
        "Active Codes": coupons.filter(c => c.isActive).length,
        "Percentage Coupon": coupons.filter(c => c.discountType === 'PERCENT').length,
        "Flat Coupon": coupons.filter(c => c.discountType === 'FLAT').length
      };
    } else if (activeTab === "registrations") {
      return {
        matches: filteredRegistrations.length,
        individual: filteredRegistrations.filter(r => r.registrationType === 'individual').length,
        group: [...new Set(filteredRegistrations.filter(r => r.registrationType === 'group').map(r => r._id))].length,
        charity: filteredRegistrations.filter(r => r.registrationType === 'charity').length,
        paid: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'paid').map(r => r._id))].length,
        pending: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'Pending Payment').map(r => r._id))].length,
        rejected: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'rejected').map(r => r._id))].length,
        revenue: filteredRegistrations.filter(r => r.paymentStatus === 'paid')
          .reduce((acc, curr) => {
            const isFirstMember = !curr.isGroupMember || curr.memberPosLabel === "Member 1";
            return isFirstMember ? acc + (Number(curr.amount) || Number(curr.runnerDetails?.amount) || 0) : acc;
          }, 0)
      };
    } else if (activeTab === "data-insights") {
      const totalCouponRevenue = couponChartData.reduce((a, b) => a + b.revenue, 0);
      const totalCouponUses = couponChartData.reduce((a, b) => a + b.uses, 0);
      const distinctCategories = demographicData.length;
      return {
        "Coupon Codes": coupons.length,
        "Coupon Redemptions": totalCouponUses,
        "Coupon Revenue": `₹${totalCouponRevenue.toLocaleString()}`,
        "Demographic Metrics": distinctCategories
      };
    }
    return {};
  })();

  // --- EXPORT LOGIC (UNCHANGED) ---
  const handleExportExcel = () => {
    let exportData = [];
    let fileName = "";

    if (activeTab === "users") {
      fileName = `SSI_Users_Accounts_${new Date().toLocaleDateString()}`;
      exportData = filteredUsers.map(u => ({
        "Name": u.name || "N/A",
        "Email": u.email || "N/A",
        "User ID": u._id || "N/A",
        "Phone": u.phone || "N/A",
        "Joined At": new Date(u.createdAt).toLocaleDateString()
      }));
    } else {
      fileName = `SSI_Registrations_${new Date().toLocaleDateString()}`;
      exportData = filteredRegistrations.map(r => ({
        "First Name": r.displayDetails?.firstName || "N/A",
        "Last Name": r.displayDetails?.lastName || "N/A",
        "Group Name/Individual Account": r.groupName ? `${r.groupName} (${r.memberPosLabel})` : "Individual Account",
        "Registration Type": r.registrationType || "N/A",
        "Race Category": normalizeCategory(r.displayDetails?.raceCategory || r.raceCategory || "N/A"),
        "Email": r.displayDetails?.email || "N/A",
        "Phone": r.displayDetails?.phone || "N/A",
        "WhatsApp": r.displayDetails?.whatsapp || "N/A",
        "DOB": formatDate(r.displayDetails?.dob),
        "Age": calculateAge(r.displayDetails?.dob),
        "Gender": r.displayDetails?.gender || "N/A",
        "Blood Group": r.displayDetails?.bloodGroup || "N/A",
        "Nationality": r.displayDetails?.nationality || "N/A",
        "Address": r.displayDetails?.address || r.runnerDetails?.address || "N/A",
        "City": r.displayDetails?.city || "N/A",
        "State": r.displayDetails?.state || "N/A",
        "Pincode": r.displayDetails?.pincode || "N/A",
        "Experience": r.displayDetails?.experience || "N/A",
        "T-Shirt Size": r.displayDetails?.tshirtSize || "N/A",
        "Parent Name": r.displayDetails?.parentName || "N/A",
        "Parent Phone": r.displayDetails?.parentPhone || "N/A",
        "Registration Fee": (!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.registrationFee || 0) : "—",
        "Coupon": r.couponCode || "N/A",
        "Discount": (!r.isGroupMember || r.memberPosLabel === "Member 1")
          ? (r.registrationType === "individual" ? `₹${r.discountAmount || 0}` : `${r.discountPercent || 0}%`)
          : "—",
        "Total Amount Paid": (!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.amount || 0) : "—",
        "Order ID": r.paymentDetails?.orderId || "N/A",
        "Payment ID": r.paymentDetails?.paymentId || "N/A",
        "Payment Status": r.paymentStatus || "N/A",
        "Paid Date": formatDate(r.paymentDetails?.paidAt)
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "users" ? "Users" : "Registrations");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // --- CHART DOWNLOAD LOGIC ---
  const downloadChartImage = async (ref, fileName) => {
    if (!ref?.current) {
      alert("Chart not ready for download yet. Please open the chart tab and try again.");
      return;
    }

    const element = ref.current;
    if (!element.offsetWidth || !element.offsetHeight) {
      alert("Chart is not visible or not fully rendered. Please make sure the chart is displayed and retry.");
      return;
    }

    const svg = element.querySelector('svg');
    if (svg) {
      try {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svg);

        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
          svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        if (!svgString.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
          svgString = svgString.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
          try {
            const downloadName = fileName.toLowerCase().endsWith('.png') ? fileName : `${fileName}.png`;
            const svgRect = svg.getBoundingClientRect();
            const width = Math.max(800, Math.round(svgRect.width));
            const height = Math.max(800, Math.round(svgRect.height));
            const scale = 2; // 2x to improve clarity

            const canvas = document.createElement('canvas');
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            const context = canvas.getContext('2d');

            if (context) {
              // white background
              context.fillStyle = '#ffffff';
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.setTransform(scale, 0, 0, scale, 0, 0);
              context.drawImage(img, 0, 0, width, height);

              const pngDataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = downloadName;
              link.href = pngDataUrl;
              link.click();
            } else {
              throw new Error('Cannot get 2D context');
            }
          } catch (innerError) {
            console.error('SVG conversion failed', innerError);
            // fallback to html2canvas
            fallbackHtml2Canvas(element, fileName);
          } finally {
            URL.revokeObjectURL(svgUrl);
          }
        };

        img.onerror = (err) => {
          console.error('SVG image load failed', err);
          URL.revokeObjectURL(svgUrl);
          fallbackHtml2Canvas(element, fileName);
        };

        img.src = svgUrl;
        return;
      } catch (error) {
        console.error('SVG export failed', error);
        // continue to html2canvas fallback below
      }
    }

    fallbackHtml2Canvas(element, fileName);
  };

  const fallbackHtml2Canvas = async (element, fileName) => {
    const html2canvasOptions = {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      onclone: (cloneDoc) => {
        // Force computed color values to reduce risk of oklch parsing errors.
        const fetchedRoots = element.querySelectorAll('*');
        const cloneRoots = cloneDoc.querySelectorAll('*');
        fetchedRoots.forEach((node, index) => {
          const cloneNode = cloneRoots[index];
          if (!cloneNode || !cloneNode.style) return;
          const computed = window.getComputedStyle(node);
          ['color', 'background-color', 'border-color', 'fill', 'stroke'].forEach((prop) => {
            const value = computed.getPropertyValue(prop);
            if (value) cloneNode.style.setProperty(prop, value, 'important');
          });
        });
      }
    };

    try {
      const downloadName = fileName.toLowerCase().endsWith('.png') ? fileName : `${fileName}.png`;
      const canvas = await html2canvas(element, html2canvasOptions);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      if (typeof link.download === 'string') {
        link.download = downloadName;
        link.href = dataUrl;
        link.click();
      } else {
        window.open(dataUrl, '_blank');
      }
    } catch (error) {
      console.error('Chart download failed', error);
      alert('Unable to download chart right now. Please refresh the page and try again.');
    }
  };

  const subTabClasses = (isActive) =>
    `px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition flex items-center gap-2 ${isActive
      ? "bg-teal-600 border-teal-600 text-white shadow-md"
      : "bg-white border-slate-200 text-slate-500 hover:border-teal-500"}`;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 tracking-widest animate-pulse">SYNCING SSI DATABASE...</div>;

  return (
    <main className="min-h-screen bg-[#fcfdfe] pb-16 font-sans text-slate-900 selection:bg-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Admin <span className="text-teal-600 underline decoration-teal-200 underline-offset-8">Panel</span></h1>
            <p className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Official Sprints Saga India Event Management</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[11px] font-black tracking-widest text-white hover:bg-slate-800 transition shadow-2xl active:scale-95"
          >
            <FiDownload /> DOWNLOAD EXCEL
          </button>
        </div>

        {/* DYNAMIC STATS SECTION */}
        {activeTab !== "data-insights" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10 text-slate-900">
            {Object.entries(dynamicStats).map(([key, val]) => (
              <div key={key} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 transition hover:shadow-md group">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest group-hover:text-teal-500 transition-colors">{key}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{key === 'revenue' ? `₹${val.toFixed(2)}` : val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6 mb-8">
          {/* Tab Switcher */}
          <div className="bg-slate-100 rounded-4xl p-2 flex gap-3 w-full border border-slate-200 shadow-inner">
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "users" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("users")}>Users Accounts</button>
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "registrations" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("registrations")}>Registrations</button>
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "coupons" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("coupons")}>Coupons</button>
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "data-insights" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => { setActiveTab("data-insights"); setInsightTab("coupons"); }}>Data Insights</button>
          </div>

          {/* --- COUPONS TAB: UI UPDATED WITH LOCAL SEARCH --- */}
          {activeTab === "coupons" && (
            <div className="grid lg:grid-cols-[400px_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Left Side: Create Form */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <FiZap size={120} />
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                    <FiPlus />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Create Coupon</h2>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SUMMER20"
                      className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-black uppercase text-slate-700 placeholder:text-slate-300"
                      value={couponData.code}
                      onChange={(e) => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Type</label>
                      <select
                        className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-bold text-slate-700"
                        value={couponData.discountType}
                        onChange={(e) => setCouponData({ ...couponData, discountType: e.target.value })}
                      >
                        <option value="PERCENT">PERCENTAGE %</option>
                        <option value="FLAT">FLAT ₹</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Value</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-black text-slate-700"
                        value={couponData.discountValue}
                        onChange={(e) => setCouponData({ ...couponData, discountValue: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={couponLoading} className="w-full py-5 rounded-2xl bg-slate-900 text-teal-400 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                    {couponLoading ? "Establishing..." : "Deploy Coupon"}
                  </button>
                </form>
              </div>

              {/* Right Side: List and SEARCH */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Search coupon identity..."
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                      value={couponSearch}
                      onChange={(e) => setCouponSearch(e.target.value)}
                    />
                  </div>
                  <span className="px-4 py-1.5 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-teal-100">
                    {filteredCoupons.length} Active Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[9px] tracking-widest border-b border-slate-50">
                      <tr>
                        <th className="p-6">Identity</th>
                        <th className="p-6">Method</th>
                        <th className="p-6">Benefit</th>
                        <th className="p-6 text-center">Status Control</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCoupons.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="p-6">
                            <span className="font-black text-slate-800 uppercase tracking-tighter text-lg">{c.code}</span>
                            <p className="text-[9px] text-slate-300 font-mono mt-0.5 tracking-widest uppercase">Ref: {c._id.substring(c._id.length - 6)}</p>
                          </td>
                          <td className="p-6">
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{c.discountType}</span>
                          </td>
                          <td className="p-6">
                            <span className="text-xl font-black text-teal-600 tracking-tighter">
                              {c.discountType === 'FLAT' ? `₹${c.discountValue}` : `${c.discountValue}%`}
                            </span>
                          </td>
                          <td className="p-6 text-center">
                            <button
                              onClick={() => toggleStatus(c._id)}
                              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${c.isActive
                                ? 'bg-teal-50 text-teal-600 border border-teal-200 shadow-sm shadow-teal-100'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                            >
                              {c.isActive ? 'ONLINE' : 'OFFLINE'}
                            </button>
                          </td>
                          <td className="p-6 text-right">
                            <button onClick={() => deleteCoupon(c._id)} className="p-3 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                              <FiTrash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCoupons.length === 0 && (
                    <div className="py-24 text-center flex flex-col items-center">
                      <FiInfo className="text-slate-200 mb-4" size={48} />
                      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching coupons found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- DATA INSIGHTS TAB --- */}
          {activeTab === "data-insights" && (
            <div className="flex animate-in fade-in slide-in-from-left-6 duration-700 min-h-screen -mx-4 sm:-mx-6 -mt-4">

              {/* EXTREME LEFT SIDEBAR */}
              <aside className="w-60 min-h-screen p-3 flex flex-col gap-2 border-r border-teal-200/20 shadow-2xl sticky top-0 h-screen bg-linear-to-b from-slate-900 via-[#062e2a] to-[#042f2e] text-teal-100">
                <div className="px-3 py-6 rounded-3xl bg-slate-800/60 border border-teal-300/30 shadow-inner">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-teal-300 mb-1">Analytics Dashboard</p>
                  <h3 className="text-white font-black leading-tight text-lg">Insights Control</h3>
                  <p className="text-[10px] uppercase text-teal-200/80 mt-1">Choose the report mode to visualize data.</p>
                </div>

                <button
                  onClick={() => setInsightTab("coupons")}
                  className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-black tracking-widest text-[11px] ${insightTab === "coupons" ? "bg-teal-500 text-white shadow-xl shadow-teal-900/50 border border-teal-300" : "bg-white/5 text-teal-100 hover:bg-white/20 hover:text-white"}`}
                >
                  <FiTag size={18} />
                  <div>
                    <span>Coupon Analytics</span>
                    <p className="text-[9px] font-bold uppercase text-teal-100/70">Campaign usage, revenue, discounts</p>
                  </div>
                </button>

                <button
                  onClick={() => setInsightTab("demographics")}
                  className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-black tracking-widest text-[11px] ${insightTab === "demographics" ? "bg-teal-500 text-white shadow-xl shadow-teal-900/50 border border-teal-300" : "bg-white/5 text-teal-100 hover:bg-white/20 hover:text-white"}`}
                >
                  <FiUsers size={18} />
                  <div>
                    <span>Demographics</span>
                    <p className="text-[9px] font-bold uppercase text-teal-100/70">Runner segments by category/gender/city</p>
                  </div>
                </button>

                {/* REVENUE ANALYTICS BUTTON */}
                <button
                  onClick={() => setInsightTab("revenue")}
                  className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-black tracking-widest text-[11px] ${insightTab === "revenue" ? "bg-teal-500 text-white shadow-xl shadow-teal-900/50 border border-teal-300" : "bg-white/5 text-teal-100 hover:bg-white/20 hover:text-white"}`}
                >
                  <FiCreditCard size={18} />
                  <div>
                    <span>Revenue Analytics</span>
                    <p className="text-[9px] font-bold uppercase text-teal-100/70">Income split by Gender & Category</p>
                  </div>
                </button>

                <div className="mt-auto pb-10 px-6 border-t border-white/5 pt-6">
                  <p className="text-[8px] text-teal-100/20 font-black uppercase tracking-widest leading-relaxed">Sprints Saga India<br />Internal Analytics v2.0</p>
                </div>
              </aside>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 p-8 lg:p-12 bg-[#fcfdfe]">
                {insightTab === "coupons" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {/* HEADER SECTION */}
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-16 bg-teal-500 rounded-full"></div>
                      <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Coupon Analytics</h2>
                    </div>

                    {/* TOP SUMMARY CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-md">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Total Savings Given</p>
                        <p className="text-3xl font-black text-rose-500 italic">₹{couponChartData.reduce((a, b) => a + b.discount, 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-md">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Usage Count</p>
                        <p className="text-3xl font-black text-teal-600 italic">{couponChartData.reduce((a, b) => a + b.uses, 0)} Times</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-md">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Net Coupon Revenue</p>
                        <p className="text-3xl font-black text-slate-800 italic">₹{couponChartData.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* --- MAIN UNIFIED CONTAINER --- */}
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">

                      {/* 1. DYNAMIC BAR CHART (REVENUE / USAGE) */}
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-0 gap-4 border-b border-slate-50 pb-8">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Campaign Performance</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                              Visualizing {barMetric === "revenue" ? "Total Revenue Generated (₹)" : "Total Redemptions"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadChartImage(couponBarChartRef, `coupon-bar-${barMetric}.png`)}
                              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-500"
                            >
                              Download Bar Chart
                            </button>
                            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2 border border-slate-200 shadow-inner">
                              <button
                                onClick={() => setBarMetric("revenue")}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${barMetric === "revenue" ? "bg-white text-teal-700 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                              >
                                Revenue flow
                              </button>
                              <button
                                onClick={() => setBarMetric("uses")}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${barMetric === "uses" ? "bg-white text-teal-700 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                              >
                                Usage count
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="h-[500px] w-full" ref={couponBarChartRef}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={couponChartData} margin={{ top: 40, right: 30, left: 20, bottom: 100 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                tickFormatter={(value) => barMetric === "revenue" ? `₹${value}` : value}
                              />
                              <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                                formatter={(value) => barMetric === "revenue" ? `₹${value.toLocaleString()}` : `${value} uses`}
                              />
                              <Bar
                                dataKey={barMetric}
                                fill={barMetric === "revenue" ? "#0d9488" : "#6366f1"}
                                radius={[12, 12, 0, 0]}
                                barSize={60}
                              >
                                <LabelList
                                  dataKey={barMetric}
                                  position="top"
                                  formatter={(value) => barMetric === "revenue" ? `₹${Math.round(value).toLocaleString()}` : value}
                                  style={{ fontSize: '12px', fontWeight: '900', fill: barMetric === "revenue" ? '#0d9488' : '#6366f1' }}
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* 2. MARKET SHARE PIE CHART */}
                      <div className="space-y-8 pt-6 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Usage Distribution</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total Market Share per Coupon</p>
                          </div>
                          <button
                            onClick={() => downloadChartImage(couponPieChartRef, `coupon-pie-distribution.png`)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-500"
                          >
                            Download Pie Chart
                          </button>
                        </div>

                        <div className="h-[400px] w-full" ref={couponPieChartRef}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={couponChartData}
                                dataKey="uses"
                                nameKey="name"
                                cx="50%" cy="50%"
                                innerRadius={100}
                                outerRadius={160}
                                paddingAngle={5}
                              >
                                {couponChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '30px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {insightTab === "demographics" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-16 bg-teal-500 rounded-full"></div>
                      <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Runner Demographics</h2>
                    </div>

                    {/* SUB-NAVIGATION TAB BAR */}
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-2">
                      {[
                        { id: "category", label: "Race Category", icon: <FiActivity /> },
                        { id: "gender", label: "Gender Split", icon: <FiUsers /> },
                        { id: "tshirt", label: "T-Shirt Sizes", icon: <FiTag /> },
                        { id: "city", label: "City Breakdown", icon: <FiMapPin /> },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setDemoMetric(tab.id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${demoMetric === tab.id ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            }`}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* BIG CHART CONTAINER */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl min-h-[600px] w-full">
                      <div className="text-center mb-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                          {demoMetric.replace(/^\w/, (c) => c.toUpperCase())} Distribution
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total count based on paid registrations</p>
                      </div>

                      <div className="flex justify-center gap-2 mb-6">
                        <button
                          onClick={() => downloadChartImage(pieChartRef, `demographics-pie-${demoMetric}-${genderFilter}.png`)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-500"
                        >
                          Download Pie Image
                        </button>
                        <button
                          onClick={() => downloadChartImage(barChartRef, `demographics-bar-${demoMetric}-${genderFilter}.png`)}
                          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-700"
                        >
                          Download Bar Image
                        </button>
                      </div>

                      <div className="flex justify-center gap-2 mb-6">
                        {['all', 'male', 'female', 'other'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setGenderFilter(option)}
                            className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${genderFilter === option
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                          >
                            {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="h-[450px] w-full" ref={barChartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={demographicData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              angle={demoMetric === "city" ? -45 : 0}
                              textAnchor={demoMetric === "city" ? "end" : "middle"}
                              tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                            <Tooltip
                              cursor={{ fill: '#f8fafc' }}
                              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                              dataKey="value"
                              fill={demoMetric === "category" ? "#0d9488" : demoMetric === "gender" ? "#6366f1" : "#f43f5e"}
                              radius={[12, 12, 0, 0]}
                              barSize={60}
                            >
                              <LabelList
                                dataKey="value"
                                position="top"
                                style={{ fontSize: '12px', fontWeight: '900', fill: '#1e293b' }}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-10">
                        <div className="text-center mb-4">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Demographic Pie Distribution</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Based on selected metric and gender filter</p>
                        </div>
                        <div className="h-[450px] w-full" ref={pieChartRef}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={demographicData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                paddingAngle={3}
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {demographicData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '10px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {insightTab === "revenue" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-16 bg-teal-500 rounded-full"></div>
                      <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Revenue Analytics</h2>
                    </div>

                    {/* PRIMARY TABS: RACE VS GENDER */}
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-2">
                      <button
                        onClick={() => setRevMetric("category")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${revMetric === "category" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        <FiActivity /> Race Category Revenue
                      </button>
                      <button
                        onClick={() => setRevMetric("gender")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${revMetric === "gender" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        <FiUsers /> Gender Revenue
                      </button>
                    </div>

                    {/* GENDER FILTER BUTTONS (Visible only when Gender Revenue is clicked) */}
                    {revMetric === "gender" && (
                      <div className="flex justify-center items-center gap-4 py-4 animate-in slide-in-from-top-2">
                        {['all', 'male', 'female', 'other'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setRevGenderFilter(option)}
                            className={`py-3 px-8 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${revGenderFilter === option
                                ? 'bg-teal-600 text-white shadow-teal-200 scale-105'
                                : 'bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent'
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* CHARTS CONTAINER */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl space-y-12">
                      <div className="text-center">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                          {revMetric === "gender" ? `${revGenderFilter.toUpperCase()} GENDER REVENUE PER CATEGORY` : "TOTAL REVENUE PER RACE CATEGORY"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dynamically calculated from paid registrations (₹)</p>

                        <div className="flex gap-2 justify-center mt-6">
                          <button onClick={() => downloadChartImage(revenueBarRef, `revenue-bar-${revMetric}.png`)} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700">Download Bar</button>
                          <button onClick={() => downloadChartImage(revenuePieRef, `revenue-pie-${revMetric}.png`)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500">Download Pie</button>
                        </div>
                      </div>

                      {/* BAR CHART */}
                      <div className="h-[400px] w-full" ref={revenueBarRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={revenueAnalyticsData}
                            margin={{ top: 40, right: 30, left: 20, bottom: 60 }} // Increased top margin from 20 to 40
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} />

                            {/* Change 2: Set the YAxis domain to 'auto' with a 15% buffer */}
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 'bold' }}
                              tickFormatter={(val) => `₹${val}`}
                              domain={[0, 'dataMax + 1000']} // This ensures the scale always goes ₹1000 above your highest bar
                            />

                            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />

                            <Bar dataKey="value" fill="#0d9488" radius={[10, 10, 0, 0]} barSize={60}>
                              <LabelList
                                dataKey="value"
                                position="top"
                                offset={15} // Added offset to move the label higher up
                                formatter={(val) => `₹${val.toLocaleString()}`}
                                style={{ fontSize: '11px', fontWeight: '900', fill: '#111827' }}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* PIE CHART */}
                      <div className="h-[400px] w-full pt-10 border-t border-slate-50" ref={revenuePieRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={revenueAnalyticsData.filter(item => item.value > 0)}
                              dataKey="value"
                              nameKey="name"
                              cx="50%" cy="50%"
                              innerRadius={80} outerRadius={130}
                              paddingAngle={5}
                              label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                            >
                              {revenueAnalyticsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- USERS & REGISTRATIONS SECTIONS: UNTOUCHED --- */}
        {activeTab !== "coupons" && activeTab !== "data-insights" && (
          <>
            <div className="mb-6 relative text-slate-900">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search records...`}
                className="w-full pl-11 pr-12 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 transition bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"><FiX /></button>}
            </div>

            {activeTab === "registrations" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 mb-6 text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                    <FiGrid className="text-teal-600" /> Active Filters
                  </span>
                  <button onClick={resetFilters} className="text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:underline">
                    <FiRotateCcw size={12} /> Reset All
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase text-slate-400">Filter By Type</span>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'individual', 'group', 'charity'].map(t => (
                      <button key={t} onClick={() => setRegFilter(t)} className={subTabClasses(regFilter === t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase text-slate-400">Payment Status</span>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'paid', 'pending', 'rejected'].map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={subTabClasses(statusFilter === s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase text-slate-400">Race Distance</span>
                  <div className="flex flex-wrap gap-2">
                    {['all', '5k', '10k', '21k', '35k', '42k'].map(r => (
                      <button key={r} onClick={() => setCatFilter(r)} className={subTabClasses(catFilter === r)}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {((activeTab === "users" && filteredUsers.length > 0) || (activeTab === "registrations" && filteredRegistrations.length > 0)) ? (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className={`min-w-full text-sm text-left table-fixed ${activeTab === "registrations" ? "min-w-[6500px]" : ""}`}>
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-widest">
                      <tr>
                        {activeTab === "users" ? (
                          <><th className="p-5 w-48">Name</th><th className="p-5 w-64">Email</th><th className="p-5 w-48">User ID</th><th className="p-5 w-48">Phone</th><th className="p-5 w-48">Created At</th></>
                        ) : (
                          <>
                            <th className="p-5 sticky left-0 bg-slate-50 z-30 w-48 border-r">First Name</th>
                            <th className="p-5 sticky left-48 bg-slate-50 z-30 w-48 border-r">Last Name</th>
                            <th className="p-5 w-48 text-teal-700">Group Name Individual Account</th>
                            <th className="p-5 w-40">Registration Type</th>
                            <th className="p-5 w-48 text-teal-600">Registration Category</th>
                            <th className="p-5 w-64">Member Email</th>
                            <th className="p-5 w-48">Phone Number</th>
                            <th className="p-5 w-48">WhatsApp Number</th>
                            <th className="p-5 w-40">DOB</th>
                            <th className="p-5 w-24 text-teal-600">Age</th>
                            <th className="p-5 w-32">Gender</th>
                            <th className="p-5 w-40 text-rose-600">Blood Group</th>
                            <th className="p-5 w-40">Nationality</th>
                            <th className="p-5 w-[500px]" style={{ minWidth: '500px' }}>Address</th>
                            <th className="p-5 w-48">City</th>
                            <th className="p-5 w-48">State</th>
                            <th className="p-5 w-40">Pincode</th>
                            <th className="p-5 w-40">Country</th>
                            <th className="p-5 w-40">Experience</th>
                            <th className="p-5 w-40">Finish Time</th>
                            <th className="p-5 w-40">Dietary</th>
                            <th className="p-5 w-40 font-black">T-Shirt Size</th>
                            <th className="p-5 w-64">Parent Name</th>
                            <th className="p-5 w-64">Parent Phone Number</th>
                            <th className="p-5 w-48">Registration Fee</th>
                            <th className="p-5 w-48 text-slate-400">Coupon Code</th>
                            <th className="p-5 w-48 text-slate-400">Discount</th>
                            <th className="p-5 w-48 text-slate-400">Platform Fee</th>
                            <th className="p-5 w-48 text-slate-400">PG Fee</th>
                            <th className="p-5 w-48 text-slate-400">GST Amount</th>
                            <th className="p-5 w-48 font-black text-slate-900 bg-slate-50">Amount</th>
                            <th className="p-5 w-40">ID Type</th>
                            <th className="p-5 w-64">ID Number</th>
                            <th className="p-5 w-64">ID Path</th>
                            <th className="p-5 w-64">Order ID</th>
                            <th className="p-5 w-64">Payment ID</th>
                            <th className="p-5 w-40">Status</th>
                            <th className="p-5 w-64">Paid At</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-900 font-bold uppercase">
                      {(activeTab === "users" ? filteredUsers : filteredRegistrations).map((r) => (
                        <tr key={r.rowId || r._id} className="hover:bg-slate-50 transition text-[12px] uppercase">
                          {activeTab === "users" ? (
                            <>
                              <td className="p-5 font-bold text-teal-800 uppercase">{r.name}</td>
                              <td className="p-5 text-slate-700 font-medium lowercase">{r.email}</td>
                              <td className="p-5 text-slate-900 font-mono text-[12px] font-bold tracking-tight">{r._id}</td>
                              <td className="p-5 text-slate-900 font-bold font-mono">{r.phone || "N/A"}</td>
                              <td className="p-5 text-slate-900 font-bold">{formatDate(r.createdAt)}</td>
                            </>
                          ) : (
                            <>
                              <td className="p-5 sticky left-0 bg-white z-10 border-r" style={{ width: '192px', minWidth: '192px' }}>{r.displayDetails?.firstName || "N/A"}</td>
                              <td className="p-5 sticky left-48 bg-white z-10 border-r" style={{ width: '192px', minWidth: '192px' }}>{r.displayDetails?.lastName || "N/A"}</td>
                              <td className="p-5 text-teal-700 font-black">{r.groupName ? `${r.groupName} (${r.memberPosLabel})` : "Individual Account"}</td>
                              <td className="p-5 text-slate-400 font-black">{r.registrationType || "N/A"}</td>
                              <td className="p-5 text-teal-600 font-black">
                                {normalizeCategory(r.displayDetails?.raceCategory || r.raceCategory || "N/A")}
                              </td>
                              <td className="p-5 lowercase font-medium">{r.displayDetails?.email || "N/A"}</td>
                              <td className="p-5 font-mono">{r.displayDetails?.phone || "N/A"}</td>
                              <td className="p-5 font-mono">{r.displayDetails?.whatsapp || "N/A"}</td>
                              <td className="p-5">{formatDate(r.displayDetails?.dob)}</td>
                              <td className="p-5 font-bold text-teal-700">{calculateAge(r.displayDetails?.dob)}</td>
                              <td className="p-5">{r.displayDetails?.gender || "N/A"}</td>
                              <td className="p-5 text-rose-600">{r.displayDetails?.bloodGroup || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.nationality || "N/A"}</td>
                              <td className="p-5 whitespace-normal wrap-break-words" style={{ width: '500px', minWidth: '500px' }}>{r.displayDetails?.address || r.runnerDetails?.address || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.city || r.runnerDetails?.city || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.state || r.runnerDetails?.state || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.pincode || r.runnerDetails?.pincode || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.country || r.runnerDetails?.country || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.experience || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.finishTime || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.dietary || "N/A"}</td>
                              <td className="p-5 font-black">{r.displayDetails?.tshirtSize || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.parentName || "N/A"}</td>
                              <td className="p-5">{r.displayDetails?.parentPhone || "N/A"}</td>
                              <td className="p-5">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.registrationFee || r.displayDetails?.registrationFee || 0}` : "—"}
                              </td>
                              <td className="p-5 italic text-slate-400">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.couponCode || "N/A") : "—"}
                              </td>
                              <td className="p-5 text-slate-400">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                                  r.registrationType === "individual"
                                    ? `₹${r.discountAmount || 0}`
                                    : `${r.discountPercent || 0}%`
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="p-5 text-slate-500">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.platformFee || 0}` : "—"}
                              </td>
                              <td className="p-5 text-slate-500">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.pgFee || 0}` : "—"}
                              </td>
                              <td className="p-5 text-slate-500">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.gstAmount || 0}` : "—"}
                              </td>
                              <td className="p-5 font-black bg-slate-50 border-x">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${(r.amount || r.runnerDetails?.amount || 0).toFixed(2)}` : "—"}
                              </td>
                              <td className="p-5 text-slate-500">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.idProof?.idType || "N/A") : "—"}
                              </td>
                              <td className="p-5 font-mono tracking-tighter">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.idProof?.idNumber || "N/A") : "—"}
                              </td>
                              <td className="p-5">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                                  <a href={r.idProof?.path} target="_blank" rel="noreferrer"
                                    className="text-teal-600 hover:underline flex items-center gap-1">
                                    <FiExternalLink /> VIEW FILE
                                  </a>
                                ) : "—"}
                              </td>
                              <td className="p-5 font-mono text-[10px] text-slate-400">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.paymentDetails?.orderId || "N/A") : "—"}
                              </td>
                              <td className="p-5 font-mono text-teal-700">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.paymentDetails?.paymentId || "N/A") : "—"}
                              </td>
                              <td className="p-5 text-center">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${r.paymentStatus === 'paid' ? 'bg-teal-600' : 'bg-amber-500'}`}>
                                    {r.paymentStatus || "N/A"}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="p-5 text-slate-400">
                                {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? formatDate(r.paymentDetails?.paidAt) : "—"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center text-slate-900"><FiAlertCircle className="text-slate-200 size-12 mb-4" /><p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found</p></div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;