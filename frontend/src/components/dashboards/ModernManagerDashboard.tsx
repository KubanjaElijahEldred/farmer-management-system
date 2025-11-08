import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Bell,
  Search,
  Settings,
  LogOut,
  Activity,
  Video,
  CheckCircle,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportService } from '../../services/reportService';

// Custom marker
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [12, 12],
});

const ModernManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('field_officer');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // CRUD states
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-13.95, 33.8]);
  const [cameraStreams, setCameraStreams] = useState<{ [key: string]: MediaStream | null }>({
    camera1: null,
    camera2: null
  });
  const [cameraActive, setCameraActive] = useState<{ [key: string]: boolean }>({
    camera1: false,
    camera2: false
  });

  const menuItems = [
    { id: 'field_officer', label: 'Field Officer', icon: Users },
    { id: 'financial', label: 'Financial Manager', icon: DollarSign },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'reports', label: 'Reports', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: Activity },
  ];

  // Effect to attach camera streams to video elements when they change
  useEffect(() => {
    Object.keys(cameraStreams).forEach(cameraId => {
      const stream = cameraStreams[cameraId];
      const videoElement = document.getElementById(`video-${cameraId}`) as HTMLVideoElement;
      
      if (videoElement && stream) {
        videoElement.srcObject = stream;
        videoElement.play().catch(err => console.error('Video play error:', err));
      }
    });
  }, [cameraStreams]);

  const rainfallData = [
    { time: '6 AM', value: 2.1 }, { time: '7 AM', value: 2.5 }, { time: '8 AM', value: 3.2 },
    { time: '9 AM', value: 4.5 }, { time: '10 AM', value: 5.8 }, { time: '11 AM', value: 6.2 },
    { time: '12 PM', value: 5.5 }, { time: '1 PM', value: 4.8 }, { time: '2 PM', value: 3.9 },
    { time: '3 PM', value: 3.2 }, { time: '4 PM', value: 2.8 }, { time: '5 PM', value: 2.3 },
  ];

  const deviceData = [
    { day: 'Mon', value: 85 }, { day: 'Tue', value: 92 }, { day: 'Wed', value: 88 },
    { day: 'Thu', value: 95 }, { day: 'Fri', value: 78 },
  ];

  const forecast = [
    { date: 'Mon 11/02', icon: '☀️', high: '32°C', low: '18°C', desc: 'Sunny' },
    { date: 'Tue 12/02', icon: '🌤️', high: '30°C', low: '17°C', desc: 'Cloudy' },
    { date: 'Wed 13/02', icon: '🌧️', high: '28°C', low: '16°C', desc: 'Rainy' },
    { date: 'Thu 14/02', icon: '⛈️', high: '27°C', low: '15°C', desc: 'Storms' },
    { date: 'Fri 15/02', icon: '☀️', high: '33°C', low: '19°C', desc: 'Sunny' },
  ];

  const cattleBehavior = [
    { label: 'Eating', value: 245, icon: '🌾', color: 'bg-green-500', percent: 35 },
    { label: 'Resting', value: 189, icon: '😴', color: 'bg-blue-500', percent: 27 },
    { label: 'Walking', value: 156, icon: '🚶', color: 'bg-yellow-500', percent: 22 },
    { label: 'Active', value: 98, icon: '⚡', color: 'bg-purple-500', percent: 16 },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);

  const [mapLocations, setMapLocations] = useState<any[]>([]);

  // Field Officer data
  const [fieldOfficers, setFieldOfficers] = useState<any[]>([]);

  // Farmers data
  const [farmersData, setFarmersData] = useState<any[]>([]);

  // Task Assignment State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  // Financial data
  const financialData: any[] = [];

  const [payments, setPayments] = useState<any[]>([]);

  // Reports data - load from API
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);

  // Load reports from API
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportService.getAllReports();
      const reports = response.data || [];
      setReportsData(reports);
      setPendingReports(reports.filter((r: any) => r.status === 'pending_approval'));
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  // Approve report
  const handleApproveReport = async (reportId: string) => {
    try {
      await reportService.updateReport(reportId, { status: 'approved' });
      await loadReports();
      alert('Report approved successfully!');
    } catch (error) {
      alert('Error approving report');
    }
  };

  // Reject report
  const handleRejectReport = async (reportId: string) => {
    const reason = prompt('Please enter reason for rejection:');
    if (!reason) return;
    
    try {
      await reportService.updateReport(reportId, { status: 'rejected', rejection_reason: reason });
      await loadReports();
      alert('Report rejected');
    } catch (error) {
      alert('Error rejecting report');
    }
  };

  // History data
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Approvals data
  const [approvalsData, setApprovalsData] = useState<any[]>([]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Search across all data
    const results: any[] = [];
    
    // Search farmers
    farmersData.forEach(farmer => {
      if (farmer.name.toLowerCase().includes(query.toLowerCase()) || 
          farmer.location.toLowerCase().includes(query.toLowerCase()) ||
          farmer.crops.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Farmer', name: farmer.name, details: farmer.location, section: 'field_officer', data: farmer });
      }
    });

    // Search field officers
    fieldOfficers.forEach(officer => {
      if (officer.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Field Officer', name: officer.name, details: `${officer.farmers} farmers`, section: 'field_officer', data: officer });
      }
    });

    // Search payments
    payments.forEach(payment => {
      if (payment.farmer.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Payment', name: payment.farmer, details: `K${payment.amount}`, section: 'financial', data: payment });
      }
    });

    // Search reports
    reportsData.forEach(report => {
      if (report.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Report', name: report.title, details: report.type, section: 'reports', data: report });
      }
    });

    setSearchResults(results.slice(0, 8)); // Increased to 8 results to show more options
  };

  // Handle clicking on a search result
  const handleSearchResultClick = (result: any) => {
    setActiveMenu(result.section);
    setSearchResults([]);
    setSearchQuery('');
    
    // If it's a report, show view dialog
    if (result.type === 'Report') {
      setTimeout(() => handleViewReport(result.data), 300);
    }
    // If it's a payment, could highlight or show details
    if (result.type === 'Payment') {
      setTimeout(() => handleEditPayment(result.data), 300);
    }
  };

  // Handle clicking on a notification
  const handleNotificationClick = (notification: any) => {
    setShowNotifications(false);
    
    // Navigate based on notification type
    if (notification.text.includes('Payment') || notification.text.includes('payment')) {
      setActiveMenu('financial');
    } else if (notification.text.includes('Report') || notification.text.includes('report')) {
      setActiveMenu('reports');
    } else if (notification.text.includes('Cow') || notification.text.includes('field')) {
      setActiveMenu('field_officer');
    }
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  // CRUD Handlers
  // Field Officer CRUD
  const handleAddOfficer = () => {
    setIsEditing(false);
    setEditingItem(null);
    setShowOfficerModal(true);
  };

  const handleEditOfficer = (officer: any) => {
    setIsEditing(true);
    setEditingItem(officer);
    setShowOfficerModal(true);
  };

  const handleDeleteOfficer = (id: number) => {
    if (confirm('Are you sure you want to delete this field officer?')) {
      setFieldOfficers(fieldOfficers.filter(o => o.id !== id));
    }
  };

  const handleSaveOfficer = (data: any) => {
    if (isEditing) {
      setFieldOfficers(fieldOfficers.map(o => o.id === editingItem.id ? { ...o, ...data } : o));
    } else {
      const newId = Math.max(...fieldOfficers.map(o => o.id)) + 1;
      setFieldOfficers([...fieldOfficers, { id: newId, ...data }]);
    }
    setShowOfficerModal(false);
  };

  // Payment CRUD
  const handleAddPayment = () => {
    setIsEditing(false);
    setEditingItem(null);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment: any) => {
    setIsEditing(true);
    setEditingItem(payment);
    setShowPaymentModal(true);
  };

  const handleDeletePayment = (id: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleSavePayment = (data: any) => {
    if (isEditing) {
      setPayments(payments.map(p => p.id === editingItem.id ? { ...p, ...data } : p));
    } else {
      const newId = Math.max(...payments.map(p => p.id)) + 1;
      setPayments([...payments, { id: newId, ...data }]);
    }
    setShowPaymentModal(false);
  };

  // Report CRUD
  const handleAddReport = () => {
    setIsEditing(false);
    setEditingItem(null);
    setShowReportModal(true);
  };

  const handleEditReport = (report: any) => {
    setIsEditing(true);
    setEditingItem(report);
    setShowReportModal(true);
  };

  const handleDeleteReport = (id: number) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReportsData(reportsData.filter(r => r.id !== id));
    }
  };

  const handleSaveReport = (data: any) => {
    if (isEditing) {
      setReportsData(reportsData.map(r => r.id === editingItem.id ? { ...r, ...data } : r));
    } else {
      const newId = Math.max(...reportsData.map(r => r.id)) + 1;
      setReportsData([...reportsData, { id: newId, ...data }]);
    }
    setShowReportModal(false);
  };

  const handleViewReport = (report: any) => {
    alert(`Viewing report: ${report.title}\n\nType: ${report.type}\nDate: ${report.date}\nSize: ${report.size}`);
  };

  const handleDownloadReport = (report: any) => {
    // Create a mock download
    const blob = new Blob([`Report: ${report.title}\nType: ${report.type}\nDate: ${report.date}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrintReport = (report: any) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + report.title + '</title>');
      printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;}h1{color:#14b8a6;}table{width:100%;border-collapse:collapse;margin-top:20px;}td{padding:10px;border-bottom:1px solid #ccc;}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>' + report.title + '</h1>');
      printWindow.document.write('<table>');
      printWindow.document.write('<tr><td><strong>Type:</strong></td><td>' + report.type + '</td></tr>');
      printWindow.document.write('<tr><td><strong>Date:</strong></td><td>' + report.date + '</td></tr>');
      printWindow.document.write('<tr><td><strong>Size:</strong></td><td>' + report.size + '</td></tr>');
      printWindow.document.write('<tr><td><strong>Status:</strong></td><td>' + report.status + '</td></tr>');
      printWindow.document.write('</table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Send to Manager/Financial Manager
  const handleSendToManager = (item: any) => {
    const isReport = item.title !== undefined;
    const isPayment = item.farmer !== undefined;
    const isOfficer = item.inspections !== undefined;
    const isFarmer = item.crops !== undefined;
    
    let text = '';
    let successMsg = '';
    
    if (isReport) {
      text = `New Report: ${item.title}`;
      successMsg = `Report "${item.title}" sent to Manager successfully!`;
    } else if (isPayment) {
      text = `Payment Request: ${item.farmer} - K${item.amount.toLocaleString()}`;
      successMsg = `Payment for "${item.farmer}" sent to Manager successfully!`;
    } else if (isOfficer) {
      text = `Officer Report: ${item.name} - ${item.farmers} farmers, ${item.pending} pending`;
      successMsg = `Officer "${item.name}" report sent to Manager successfully!`;
    } else if (isFarmer) {
      text = `Farmer Update: ${item.name} - ${item.location} (${item.tasks} tasks)`;
      successMsg = `Farmer "${item.name}" information sent to Manager successfully!`;
    } else {
      text = `New Item sent for review`;
      successMsg = `Item sent to Manager successfully!`;
    }
    
    const newNotification = {
      id: notifications.length + 1,
      text: text,
      time: 'Just now',
      urgent: false,
      recipient: 'manager'
    };
    setNotifications([newNotification, ...notifications]);
    alert(successMsg);
  };

  const handleSendToFinancialManager = (item: any) => {
    const isReport = item.title !== undefined;
    const isPayment = item.farmer !== undefined;
    const isOfficer = item.inspections !== undefined;
    
    let text = '';
    let successMsg = '';
    
    if (isReport) {
      text = `Financial Report: ${item.title}`;
      successMsg = `Report "${item.title}" sent to Financial Manager successfully!`;
    } else if (isPayment) {
      text = `Payment Approval: ${item.farmer} - K${item.amount.toLocaleString()}`;
      successMsg = `Payment for "${item.farmer}" sent to Financial Manager successfully!`;
    } else if (isOfficer) {
      text = `Officer Budget Request: ${item.name} - ${item.farmers} farmers assigned`;
      successMsg = `Officer "${item.name}" budget request sent to Financial Manager successfully!`;
    } else {
      text = `New financial item for review`;
      successMsg = `Item sent to Financial Manager successfully!`;
    }
    
    const newNotification = {
      id: notifications.length + 1,
      text: text,
      time: 'Just now',
      urgent: false,
      recipient: 'financial'
    };
    setNotifications([newNotification, ...notifications]);
    alert(successMsg);
  };

  // Task Assignment Handlers
  const handleAssignTask = (farmer: any) => {
    setSelectedFarmer(farmer);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData: any) => {
    // Update farmer's task count
    setFarmersData(farmersData.map(f => 
      f.id === selectedFarmer.id 
        ? { ...f, tasks: f.tasks + 1 } 
        : f
    ));

    // Create notification
    const newNotification = {
      id: notifications.length + 1,
      text: `Task Assigned: ${taskData.task} to ${selectedFarmer.name}`,
      time: 'Just now',
      urgent: false,
      recipient: 'manager'
    };
    setNotifications([newNotification, ...notifications]);

    setShowTaskModal(false);
    setSelectedFarmer(null);
    alert(`Task "${taskData.task}" assigned to ${selectedFarmer.name} successfully!`);
  };

  // History cannot be edited/deleted, only viewed

  // Location handlers
  const handleAddLocation = () => {
    setShowLocationModal(true);
  };

  const handleSaveLocation = (data: any) => {
    const newId = mapLocations.length > 0 ? Math.max(...mapLocations.map(l => l.id)) + 1 : 1;
    setMapLocations([...mapLocations, { 
      id: newId, 
      name: data.name, 
      lat: parseFloat(data.lat), 
      lng: parseFloat(data.lng) 
    }]);
    setShowLocationModal(false);
  };

  const handleDeleteLocation = (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setMapLocations(mapLocations.filter(l => l.id !== id));
    }
  };

  // Get current location using browser geolocation
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newLocation = {
          id: mapLocations.length > 0 ? Math.max(...mapLocations.map(l => l.id)) + 1 : 1,
          name: 'My Current Location',
          lat: lat,
          lng: lng
        };
        setMapLocations([...mapLocations, newLocation]);
        setMapCenter([lat, lng]);
        alert(`Location added!\nLatitude: ${lat.toFixed(4)}\nLongitude: ${lng.toFixed(4)}`);
      },
      (error) => {
        alert('Unable to get your location. Please check your browser permissions.');
        console.error('Geolocation error:', error);
      }
    );
  };

  // Search for a location using Nominatim (OpenStreetMap) geocoding
  const handleSearchLocation = async () => {
    if (!locationSearch.trim()) {
      alert('Please enter a location to search');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const newLocation = {
          id: mapLocations.length > 0 ? Math.max(...mapLocations.map(l => l.id)) + 1 : 1,
          name: result.display_name.split(',')[0], // Take first part of address
          lat: lat,
          lng: lng
        };
        setMapLocations([...mapLocations, newLocation]);
        setMapCenter([lat, lng]);
        setLocationSearch('');
        alert(`Location found and added: ${newLocation.name}`);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      alert('Error searching for location. Please try again.');
      console.error('Geocoding error:', error);
    }
  };

  // Camera control functions
  const startCamera = async (cameraId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // Use front camera by default
        }, 
        audio: false 
      });
      
      setCameraStreams(prev => ({ ...prev, [cameraId]: stream }));
      setCameraActive(prev => ({ ...prev, [cameraId]: true }));
      
      // Wait for next tick to ensure video element exists
      setTimeout(() => {
        const videoElement = document.getElementById(`video-${cameraId}`) as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.onloadedmetadata = () => {
            videoElement.play().catch(err => console.error('Play error:', err));
          };
        }
      }, 100);
    } catch (error) {
      alert('Unable to access camera. Please check your browser permissions.');
      console.error('Camera error:', error);
      setCameraActive(prev => ({ ...prev, [cameraId]: false }));
    }
  };

  const stopCamera = (cameraId: string) => {
    const stream = cameraStreams[cameraId];
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setCameraStreams(prev => ({ ...prev, [cameraId]: null }));
      setCameraActive(prev => ({ ...prev, [cameraId]: false }));
      
      const videoElement = document.getElementById(`video-${cameraId}`) as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = null;
      }
    }
  };

  const toggleCamera = (cameraId: string) => {
    if (cameraActive[cameraId]) {
      stopCamera(cameraId);
    } else {
      startCamera(cameraId);
    }
  };

  // Approval handlers
  const handleApprove = (id: number) => {
    const approval = approvalsData.find(a => a.id === id);
    if (approval && confirm(`Approve: ${approval.title}?`)) {
      setApprovalsData(approvalsData.filter(a => a.id !== id));
      // Add to history
      const newHistoryItem = {
        id: historyData.length + 1,
        action: 'Approved',
        user: user?.name || 'Manager',
        description: approval.title,
        time: new Date().toISOString(),
        type: approval.type
      };
      setHistoryData([newHistoryItem, ...historyData]);
    }
  };

  const handleReject = (id: number) => {
    const approval = approvalsData.find(a => a.id === id);
    if (approval && confirm(`Reject: ${approval.title}?`)) {
      setApprovalsData(approvalsData.filter(a => a.id !== id));
      // Add to history
      const newHistoryItem = {
        id: historyData.length + 1,
        action: 'Rejected',
        user: user?.name || 'Manager',
        description: approval.title,
        time: new Date().toISOString(),
        type: approval.type
      };
      setHistoryData([newHistoryItem, ...historyData]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-900 via-green-800 to-teal-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-teal-900/90 to-teal-950/90 backdrop-blur-md border-r border-teal-700/50 flex flex-col">
        <div className="p-6 border-b border-teal-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🌾</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Farm Management</h1>
              <p className="text-teal-300 text-xs">System Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'text-teal-200 hover:bg-teal-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-teal-700/50 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-teal-200 hover:bg-teal-800/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-900/80 to-green-900/80 backdrop-blur-md border-b border-teal-700/50 px-8 py-4 relative z-[100]">
          <div className="flex items-center justify-between">
            
            <div className="flex-1 max-w-md mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300" />
                <input
                  type="text"
                  placeholder="Type here..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-teal-900/95 backdrop-blur-md border border-teal-700/50 rounded-lg shadow-xl z-[1000]">
                  {searchResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSearchResultClick(result)}
                      className="px-4 py-3 hover:bg-teal-800/50 border-b border-teal-800/30 last:border-0 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium text-sm">{result.name}</p>
                          <p className="text-teal-300 text-xs">{result.details}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-teal-700/50 rounded text-teal-200">{result.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 bg-teal-800/50 hover:bg-teal-700/50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-teal-900/95 backdrop-blur-md border border-teal-700/50 rounded-lg shadow-xl z-[1000]">
                    <div className="p-4 border-b border-teal-700/50">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 hover:bg-teal-800/30 border-b border-teal-800/30 last:border-0 cursor-pointer transition-colors ${notif.urgent ? 'bg-red-900/20' : ''}`}
                        >
                          <p className="text-white text-sm mb-1">{notif.text}</p>
                          <p className="text-teal-300 text-xs">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-teal-700/50 text-center">
                      <button className="text-teal-300 hover:text-white text-sm">View All</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 bg-teal-800/50 hover:bg-teal-700/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 bg-teal-800/50 hover:bg-teal-700/50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>

              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'M'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-y-auto p-6 relative z-[1]">
          {/* Field Officer Section */}
          {activeMenu === 'field_officer' && (
          <div className="grid grid-cols-12 gap-4">
            {/* Welcome Card - Row 1 */}
            <div className="col-span-3 bg-gradient-to-br from-green-600/30 to-teal-600/30 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
              <div className="relative z-10">
                <h3 className="text-white text-2xl font-bold mb-2">{user?.name || 'Mark Johnson'}</h3>
                <p className="text-green-200 text-sm mb-4">Welcome back and have a nice day!</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                  📊 Reports
                </button>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h3 className="text-teal-200 text-xs font-medium mb-2">Weather Report</h3>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white text-5xl font-bold mb-1">37°C</p>
                  <p className="text-green-300 text-sm">77% Humidity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">☀️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Table */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3 text-sm">Forecast by Google</h3>
              <div className="space-y-2">
                {forecast.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-teal-900/30 rounded-lg p-2">
                    <span className="text-teal-200 w-16">{day.date}</span>
                    <span className="text-xl">{day.icon}</span>
                    <div className="flex space-x-2">
                      <span className="text-white font-medium">{day.high}</span>
                      <span className="text-teal-300">{day.low}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satellite Map */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-3 relative z-[10] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold text-sm">Map Locations</h3>
                <button 
                  onClick={handleAddLocation}
                  className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs font-medium"
                >
                  + Add
                </button>
              </div>

              {/* Location Search */}
              <div className="mb-2 space-y-1">
                <div className="flex space-x-1">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                    placeholder="Search location..."
                    className="flex-1 bg-teal-900/50 border border-teal-700/50 rounded px-2 py-1 text-white text-xs placeholder-teal-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSearchLocation}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium"
                  >
                    🔍
                  </button>
                </div>
                <button
                  onClick={handleGetMyLocation}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium"
                >
                  📍 Get My Location
                </button>
              </div>
              
              {/* Map View */}
              <div className="flex-1 rounded-xl overflow-hidden relative mb-2" style={{ minHeight: '200px' }}>
                <MapContainer
                  center={mapCenter}
                  key={mapCenter.join(',')}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Esri'
                  />
                  {mapLocations.map((loc) => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                      <Popup>{loc.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Locations List */}
              <div className="bg-teal-900/30 rounded-lg p-2 max-h-32 overflow-y-auto">
                <div className="text-xs text-teal-300 mb-1 font-semibold">Saved Locations ({mapLocations.length})</div>
                <div className="space-y-1">
                  {mapLocations.map((loc) => (
                    <div key={loc.id} className="flex justify-between items-center bg-teal-800/30 p-1.5 rounded">
                      <div className="text-white text-xs">{loc.name}</div>
                      <button 
                        onClick={() => handleDeleteLocation(loc.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rainfall Chart - Row 2 */}
            <div className="col-span-6 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Rainfall (inches)</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium">
                  Moisture Report
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rainfallData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf30" />
                  <XAxis dataKey="time" stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#134e4a', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cattle Behavior */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Cattle Behaviour</h3>
              <div className="grid grid-cols-2 gap-4">
                {cattleBehavior.map((item, idx) => (
                  <div key={idx} className="bg-teal-900/40 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                      {item.value}
                    </div>
                    <p className="text-teal-200 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-white text-sm">Total Devices: <span className="font-bold">300</span></p>
              </div>
            </div>

            {/* Notifications */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`bg-teal-900/40 rounded-lg p-3 border-l-4 ${notif.urgent ? 'border-red-500' : 'border-blue-500'}`}>
                    <p className="text-white text-xs mb-1">{notif.text}</p>
                    <p className="text-teal-300 text-xs">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Officers Table - Full Width */}
            <div className="col-span-12 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold text-lg">Field Officers Management</h3>
                <button 
                  onClick={handleAddOfficer}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Add Officer
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-teal-700/50">
                      <th className="text-left text-teal-200 font-semibold p-4">Name</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Farmers</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Inspections</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Pending</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Efficiency</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldOfficers.map((officer) => (
                      <tr key={officer.id} className="border-t border-teal-800/50 hover:bg-teal-800/30">
                        <td className="text-white p-4 font-medium">{officer.name}</td>
                        <td className="text-teal-300 p-4">{officer.farmers}</td>
                        <td className="text-teal-300 p-4">{officer.inspections}</td>
                        <td className="text-teal-300 p-4">{officer.pending}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-teal-900/50 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${officer.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm font-medium">{officer.efficiency}%</span>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                            <button 
                              onClick={() => handleSendToManager(officer)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Send to Manager"
                            >
                              📤 Manager
                            </button>
                            <button 
                              onClick={() => handleSendToFinancialManager(officer)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Send to Financial Manager"
                            >
                              💰 Finance
                            </button>
                            <button 
                              onClick={() => handleEditOfficer(officer)}
                              className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Edit Officer"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteOfficer(officer.id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Delete Officer"
                            >
                              🗑️ Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Farmers Management Table - Full Width */}
            <div className="col-span-12 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold text-lg">Farmers Management & Task Assignment</h3>
                <div className="flex space-x-2">
                  <button 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    + Add Farmer
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-teal-700/50">
                      <th className="text-left text-teal-200 font-semibold p-4">Name</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Location</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Crops</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Assigned Officer</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Tasks</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Status</th>
                      <th className="text-left text-teal-200 font-semibold p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmersData.map((farmer) => (
                      <tr key={farmer.id} className="border-t border-teal-800/50 hover:bg-teal-800/30">
                        <td className="text-white p-4 font-medium">{farmer.name}</td>
                        <td className="text-teal-300 p-4">{farmer.location}</td>
                        <td className="text-teal-300 p-4 text-sm">{farmer.crops}</td>
                        <td className="text-teal-300 p-4">{farmer.officer}</td>
                        <td className="text-teal-300 p-4">
                          <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-xs font-medium">
                            {farmer.tasks} {farmer.tasks === 1 ? 'task' : 'tasks'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            farmer.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {farmer.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                            <button 
                              onClick={() => handleAssignTask(farmer)}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Assign Task"
                            >
                              📋 Assign Task
                            </button>
                            <button 
                              onClick={() => handleSendToManager(farmer)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Send to Manager"
                            >
                              📤 Manager
                            </button>
                            <button 
                              className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Edit Farmer"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Delete Farmer"
                            >
                              🗑️ Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CCTV Feeds - Row 3 */}
            <div className="col-span-6 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">CCTV</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Camera Feed 1 */}
                <div className="relative rounded-xl overflow-hidden bg-black h-52">
                  {cameraActive.camera1 ? (
                    <video 
                      id="video-camera1"
                      autoPlay 
                      playsInline 
                      muted
                      controls={false}
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-orange-600">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-white/50 mx-auto mb-2" />
                        <p className="text-white text-sm mb-2">Field Camera 1</p>
                        <p className="text-white/70 text-xs mb-3">Camera Offline</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 ${cameraActive.camera1 ? 'bg-red-500' : 'bg-gray-500'} text-white text-xs rounded-full`}>
                      {cameraActive.camera1 ? '🔴 LIVE' : '⚫ OFF'}
                    </span>
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Field Camera 1</span>
                  </div>
                  <button 
                    onClick={() => toggleCamera('camera1')}
                    className={`absolute bottom-3 right-3 ${cameraActive.camera1 ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
                  >
                    {cameraActive.camera1 ? '⏹ Stop' : '▶ Start'}
                  </button>
                </div>

                {/* Camera Feed 2 */}
                <div className="relative rounded-xl overflow-hidden bg-black h-52">
                  {cameraActive.camera2 ? (
                    <video 
                      id="video-camera2"
                      autoPlay 
                      playsInline 
                      muted
                      controls={false}
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-700 to-teal-700">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-white/50 mx-auto mb-2" />
                        <p className="text-white text-sm mb-2">Barn Camera 2</p>
                        <p className="text-white/70 text-xs mb-3">Camera Offline</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 ${cameraActive.camera2 ? 'bg-red-500' : 'bg-gray-500'} text-white text-xs rounded-full`}>
                      {cameraActive.camera2 ? '🔴 LIVE' : '⚫ OFF'}
                    </span>
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Barn Camera 2</span>
                  </div>
                  <button 
                    onClick={() => toggleCamera('camera2')}
                    className={`absolute bottom-3 right-3 ${cameraActive.camera2 ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
                  >
                    {cameraActive.camera2 ? '⏹ Stop' : '▶ Start'}
                  </button>
                </div>
              </div>
            </div>

            {/* Device Activity Chart */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-semibold">Total Devices: 100</h3>
                  <p className="text-teal-300 text-xs">Online Devices: 96</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={deviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf30" />
                  <XAxis dataKey="day" stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#134e4a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="col-span-3 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-teal-200 text-sm">Active Farmers</span>
                  <span className="text-white font-bold text-lg">248</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-teal-200 text-sm">Total Fields</span>
                  <span className="text-white font-bold text-lg">64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-teal-200 text-sm">Harvests (MTD)</span>
                  <span className="text-white font-bold text-lg">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-teal-200 text-sm">Revenue (MTD)</span>
                  <span className="text-green-400 font-bold text-lg">K425K</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Financial Manager Section */}
          {activeMenu === 'financial' && (
          <div className="grid grid-cols-12 gap-4">
            {/* Financial Stats */}
            <div className="col-span-3 bg-gradient-to-br from-green-600/30 to-teal-600/30 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-teal-200 text-xs font-medium mb-2">Total Revenue</h3>
              <p className="text-white text-4xl font-bold mb-1">K1.36M</p>
              <p className="text-green-300 text-sm">+12% from last month</p>
            </div>

            <div className="col-span-3 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6">
              <h3 className="text-teal-200 text-xs font-medium mb-2">Total Expenses</h3>
              <p className="text-white text-4xl font-bold mb-1">K851K</p>
              <p className="text-red-300 text-sm">Operations cost</p>
            </div>

            <div className="col-span-3 bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-teal-200 text-xs font-medium mb-2">Net Profit</h3>
              <p className="text-white text-4xl font-bold mb-1">K509K</p>
              <p className="text-green-300 text-sm">37.4% margin</p>
            </div>

            <div className="col-span-3 bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-teal-200 text-xs font-medium mb-2">Pending Payments</h3>
              <p className="text-white text-4xl font-bold mb-1">K79K</p>
              <p className="text-yellow-300 text-sm">2 payments</p>
            </div>

            {/* Revenue Chart */}
            <div className="col-span-8 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Financial Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf30" />
                  <XAxis dataKey="month" stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#5eead4" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#134e4a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payments List */}
            <div className="col-span-4 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Recent Payments</h3>
                <button 
                  onClick={handleAddPayment}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-teal-900/40 rounded-lg p-3 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-medium text-sm">{payment.farmer}</p>
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-green-400 font-bold text-lg">K{payment.amount.toLocaleString()}</p>
                    <p className="text-teal-300 text-xs mt-1">{payment.date}</p>
                    
                    {/* Action buttons */}
                    <div className="mt-3 flex space-x-1 flex-wrap gap-y-1">
                      <button 
                        onClick={() => handleSendToManager(payment)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                        title="Send to Manager"
                      >
                        📤 Manager
                      </button>
                      <button 
                        onClick={() => handleSendToFinancialManager(payment)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                        title="Send to Financial Manager"
                      >
                        💰 Finance
                      </button>
                      <button 
                        onClick={() => handleEditPayment(payment)}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                        title="Edit Payment"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePayment(payment.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                        title="Delete Payment"
                      >
                        🗑️ Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Approvals Section */}
          {activeMenu === 'approvals' && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-white text-2xl font-bold">📋 Pending Report Approvals</h2>
                  <p className="text-teal-300 text-sm mt-1">{pendingReports.length} reports from field officers awaiting your review</p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 rounded-xl p-4 border border-yellow-500/30">
                  <div className="text-yellow-300 text-sm mb-2">Pending Reports</div>
                  <div className="text-white text-3xl font-bold">{pendingReports.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/30 to-green-700/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-green-300 text-sm mb-2">Approved</div>
                  <div className="text-white text-3xl font-bold">{reportsData.filter(r => r.status === 'approved').length}</div>
                </div>
                <div className="bg-gradient-to-br from-red-600/30 to-red-700/30 rounded-xl p-4 border border-red-500/30">
                  <div className="text-red-300 text-sm mb-2">Rejected</div>
                  <div className="text-white text-3xl font-bold">{reportsData.filter(r => r.status === 'rejected').length}</div>
                </div>
              </div>

              {/* Reports Approval List */}
              <div className="space-y-4">
                {pendingReports.length === 0 ? (
                  <div className="bg-teal-900/20 rounded-xl p-12 text-center">
                    <FileText className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                    <p className="text-teal-300 text-lg">No pending reports at this time</p>
                    <p className="text-teal-400 text-sm mt-2">Reports from field officers will appear here for approval</p>
                  </div>
                ) : (
                  pendingReports.map((report) => (
                    <div key={report._id} className="bg-teal-900/30 rounded-xl p-6 hover:bg-teal-800/40 transition-colors border border-teal-700/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className="w-5 h-5 text-teal-300" />
                            <h3 className="text-white font-semibold text-lg">{report.report_type.replace('_', ' ').toUpperCase()}</h3>
                            <span className="px-3 py-1 bg-yellow-600/80 rounded-full text-xs text-white font-medium">
                              PENDING
                            </span>
                          </div>
                          <p className="text-teal-300 text-sm mb-3">{report.data?.content || 'No description available'}</p>
                          <div className="flex items-center space-x-6 text-sm">
                            <span className="text-teal-400">
                              <strong>Submitted by:</strong> Field Officer
                            </span>
                            <span className="text-teal-400">
                              <strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-teal-400">
                              <strong>Time:</strong> {new Date(report.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-3 ml-6">
                          <button 
                            onClick={() => handleApproveReport(report._id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button 
                            onClick={() => handleRejectReport(report._id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {approvalsData.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">All Caught Up!</h3>
                    <p className="text-teal-300">No pending approvals at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Reports Section */}
          {activeMenu === 'reports' && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-bold">System Reports</h2>
                <button 
                  onClick={handleAddReport}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  + Generate New Report
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-blue-300 text-sm mb-2">Total Reports</div>
                  <div className="text-white text-3xl font-bold">{reportsData.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/30 to-green-700/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-green-300 text-sm mb-2">This Month</div>
                  <div className="text-white text-3xl font-bold">12</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-purple-300 text-sm mb-2">Categories</div>
                  <div className="text-white text-3xl font-bold">4</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 rounded-xl p-4 border border-yellow-500/30">
                  <div className="text-yellow-300 text-sm mb-2">Total Size</div>
                  <div className="text-white text-3xl font-bold">11.5 MB</div>
                </div>
              </div>

              <div className="bg-teal-900/30 rounded-xl overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-teal-900/50">
                    <tr>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap">Report Title</th>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap">Type</th>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap">Date</th>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap">Size</th>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap">Status</th>
                      <th className="text-left text-teal-300 text-sm font-semibold p-4 whitespace-nowrap w-72">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsData.map((report) => (
                      <tr key={report.id} className="border-t border-teal-800/50 hover:bg-teal-800/30">
                        <td className="text-white p-4 whitespace-nowrap">{report.title}</td>
                        <td className="text-teal-300 p-4 whitespace-nowrap">{report.type}</td>
                        <td className="text-teal-300 p-4 whitespace-nowrap">{report.date}</td>
                        <td className="text-teal-300 p-4 whitespace-nowrap">{report.size}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                            <button 
                              onClick={() => handleViewReport(report)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="View Report"
                            >
                              📄 View
                            </button>
                            <button 
                              onClick={() => handleDownloadReport(report)}
                              className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Download Report"
                            >
                              📥 Down
                            </button>
                            <button 
                              onClick={() => handlePrintReport(report)}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Print Report"
                            >
                              🖨️ Print
                            </button>
                            <button 
                              onClick={() => handleSendToManager(report)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Send to Manager"
                            >
                              📤 Manager
                            </button>
                            <button 
                              onClick={() => handleSendToFinancialManager(report)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Send to Financial Manager"
                            >
                              💰 Finance
                            </button>
                            <button 
                              onClick={() => handleEditReport(report)}
                              className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Edit Report"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteReport(report.id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                              title="Delete Report"
                            >
                              🗑️ Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}

          {/* History Section */}
          {activeMenu === 'history' && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 bg-gradient-to-br from-teal-800/40 to-green-800/40 backdrop-blur-md border border-teal-600/30 rounded-2xl p-6">
              <h2 className="text-white text-2xl font-bold mb-6">System Activity History</h2>
              
              <div className="space-y-4">
                {historyData.map((item) => (
                  <div key={item.id} className="bg-teal-900/30 rounded-xl p-4 hover:bg-teal-800/40 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">{item.action}</h4>
                          <span className="text-teal-400 text-sm">{item.time}</span>
                        </div>
                        <p className="text-teal-300 text-sm mb-2">{item.description}</p>
                        <p className="text-teal-400 text-xs">By: {item.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowSettings(false)}>
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-700/50 rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-2xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-teal-200 text-sm mb-2 block">Account Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="text-teal-200 text-sm mb-2 block">Role</label>
                <input 
                  type="text" 
                  value={user?.role || ''} 
                  disabled
                  className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white capitalize"
                />
              </div>

              <div>
                <label className="text-teal-200 text-sm mb-2 block">Theme</label>
                <select className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white">
                  <option>Dark Mode</option>
                  <option>Light Mode</option>
                </select>
              </div>

              <div>
                <label className="text-teal-200 text-sm mb-2 block">Notifications</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-white text-sm">Enable push notifications</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-700/50 rounded-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-2xl font-bold mb-4">Confirm Logout</h2>
            <p className="text-teal-200 mb-6">Are you sure you want to logout from the system?</p>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-700/50 rounded-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-2xl font-bold mb-6">{isEditing ? 'Edit Payment' : 'Add New Payment'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSavePayment({
                farmer: formData.get('farmer'),
                amount: Number(formData.get('amount')),
                status: formData.get('status'),
                date: formData.get('date')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Farmer Name</label>
                  <input 
                    name="farmer"
                    type="text" 
                    required
                    defaultValue={editingItem?.farmer || ''}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter farmer name"
                  />
                </div>
                
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Amount (K)</label>
                  <input 
                    name="amount"
                    type="number" 
                    required
                    defaultValue={editingItem?.amount || ''}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Status</label>
                  <select 
                    name="status"
                    defaultValue={editingItem?.status || 'Pending'}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Date</label>
                  <input 
                    name="date"
                    type="date" 
                    required
                    defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowReportModal(false)}>
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-700/50 rounded-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-2xl font-bold mb-6">{isEditing ? 'Edit Report' : 'Generate New Report'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveReport({
                title: formData.get('title'),
                type: formData.get('type'),
                date: formData.get('date'),
                status: 'Completed',
                size: formData.get('size') || '0 MB'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Report Title</label>
                  <input 
                    name="title"
                    type="text" 
                    required
                    defaultValue={editingItem?.title || ''}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter report title"
                  />
                </div>
                
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Type</label>
                  <select 
                    name="type"
                    defaultValue={editingItem?.type || 'Harvest'}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Harvest">Harvest</option>
                    <option value="Financial">Financial</option>
                    <option value="Performance">Performance</option>
                    <option value="Health">Health</option>
                    <option value="Inventory">Inventory</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Size</label>
                  <input 
                    name="size"
                    type="text" 
                    defaultValue={editingItem?.size || ''}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., 2.4 MB"
                  />
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Date</label>
                  <input 
                    name="date"
                    type="date" 
                    required
                    defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Update' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-600/50 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-2xl font-bold mb-6">Add New Location</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveLocation({
                name: formData.get('name'),
                lat: formData.get('lat'),
                lng: formData.get('lng')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Location Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., Eastern Field, Water Source 1"
                  />
                </div>
                
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Latitude</label>
                  <input 
                    name="lat"
                    type="number" 
                    step="0.0001"
                    required
                    defaultValue="-13.95"
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., -13.95"
                  />
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Longitude</label>
                  <input 
                    name="lng"
                    type="number" 
                    step="0.0001"
                    required
                    defaultValue="33.8"
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., 33.8"
                  />
                </div>

                <div className="bg-teal-800/30 rounded-lg p-3 text-xs text-teal-300">
                  💡 Tip: You can get coordinates from Google Maps by right-clicking on a location
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showTaskModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-gradient-to-br from-teal-900/95 to-green-900/95 backdrop-blur-md border border-teal-600/50 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-2xl font-bold mb-6">Assign Task to {selectedFarmer.name}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveTask({
                task: formData.get('task'),
                priority: formData.get('priority'),
                deadline: formData.get('deadline'),
                description: formData.get('description')
              });
            }}>
              <div className="space-y-4">
                {/* Farmer Info */}
                <div className="bg-teal-800/30 rounded-lg p-3">
                  <div className="text-teal-200 text-sm mb-1">Farmer Details:</div>
                  <div className="text-white text-sm">{selectedFarmer.location} - {selectedFarmer.crops}</div>
                  <div className="text-teal-300 text-xs mt-1">Assigned Officer: {selectedFarmer.officer}</div>
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Task Title *</label>
                  <input 
                    name="task"
                    type="text" 
                    required
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., Inspect irrigation system"
                  />
                </div>
                
                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Priority *</label>
                  <select 
                    name="priority"
                    required
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium" selected>Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Deadline</label>
                  <input 
                    name="deadline"
                    type="date" 
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-teal-200 text-sm mb-2 block">Description</label>
                  <textarea 
                    name="description"
                    rows={3}
                    className="w-full bg-teal-900/50 border border-teal-700/50 rounded-lg px-4 py-2 text-white resize-none"
                    placeholder="Add task details..."
                  />
                </div>

                <div className="bg-blue-800/30 rounded-lg p-3 text-xs text-blue-200">
                  💡 Tip: The assigned officer will be notified about this task automatically
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedFarmer(null);
                  }}
                  className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ModernManagerDashboard;
