# 🔄 Dynamic Content Dashboard Guide

## ✨ Overview
The Manager Dashboard now changes its content dynamically based on which sidebar button you click!

---

## 🎯 How It Works

When you click a sidebar button, the `activeMenu` state updates and shows different content in the dashboard cards.

---

## 📊 Content by Section

### 1. **👥 Field Officer** (Default)
**What You See:**
- Welcome card with user greeting
- Weather widget (37°C, humidity)
- 5-day forecast table
- Real satellite map with location markers
- Rainfall analytics chart
- Cattle behavior monitoring (4 activities)
- Real-time notifications
- CCTV live feeds (2 cameras)
- Device activity bar chart
- Quick stats (Farmers, Fields, Harvests, Revenue)

**Data Displayed:**
- Field officer performance metrics
- Farm locations on map
- Weather conditions
- Livestock monitoring
- IoT device status

---

### 2. **💰 Financial Manager**
**What You See:**
- **4 Financial Cards:**
  - Total Revenue: K1.36M (+12%)
  - Total Expenses: K851K
  - Net Profit: K509K (37.4% margin)
  - Pending Payments: K79K (2 payments)

- **Financial Overview Chart:**
  - Bar chart with 6 months of data
  - Shows Revenue, Expenses, and Profit
  - Color-coded bars (Green, Red, Blue)

- **Recent Payments List:**
  - 4 payment cards showing:
    - Farmer name
    - Amount
    - Status (Completed/Pending/Processing)
    - Date

**Data Displayed:**
- Monthly financial trends
- Payment tracking
- Profit margins
- Expense breakdown

---

### 3. **📊 Reports**
**What You See:**
- **Generate Report Button** at top

- **4 Quick Stats Cards:**
  - Total Reports: 4
  - This Month: 12
  - Categories: 4
  - Total Size: 11.5 MB

- **Reports Table:**
  - Columns: Title, Type, Date, Size, Status, Actions
  - Reports included:
    - Monthly Harvest Report (2.4 MB)
    - Financial Summary Q1 (1.8 MB)
    - Field Officer Performance (3.2 MB)
    - Livestock Health Report (4.1 MB)
  - Actions: View / Download buttons

**Data Displayed:**
- All system reports
- Report metadata
- Download options

---

### 4. **📈 History**
**What You See:**
- **System Activity Timeline**
- Each activity shows:
  - Type badge (PAYMENT/INSPECTION/REPORT/FARMER)
  - Action title
  - Description
  - User who performed it
  - Timestamp

**Sample Activities:**
1. 🟢 **Payment Processed** - K45,000 to John Doe (Finance Manager, 14:30)
2. 🔵 **Field Inspection** - North Field completed (Michael Brown, 10:15)
3. 🟣 **Report Generated** - Monthly harvest report (System, 16:45)
4. 🟡 **New Farmer Added** - Robert Taylor registered (Manager, 09:20)
5. 🟢 **Payment Approved** - K38,000 for Jane Smith (Finance Manager, 11:00)

**Data Displayed:**
- Chronological activity log
- User attribution
- Action timestamps
- Activity types with color coding

---

## 🎨 Visual Changes

### Color Coding by Section:

**Field Officer:**
- Primary: Green/Teal
- Charts: Blue area chart
- Accents: Yellow, Purple

**Financial Manager:**
- Cards: Green, Yellow/Orange, Blue/Purple, Purple/Pink gradients
- Chart: Green (Revenue), Red (Expenses), Blue (Profit)
- Status badges: Green/Yellow/Blue

**Reports:**
- Stats: Blue, Green, Purple, Yellow gradients
- Table: Teal theme
- Actions: Blue/Green text

**History:**
- Timeline cards: Teal theme
- Badges: Green (payment), Blue (inspection), Purple (report), Yellow (farmer)

---

## 🔧 Technical Implementation

### State Management:
```typescript
const [activeMenu, setActiveMenu] = useState('field_officer');
```

### Conditional Rendering:
```typescript
{activeMenu === 'field_officer' && (
  // Field Officer content
)}

{activeMenu === 'financial' && (
  // Financial content
)}

{activeMenu === 'reports' && (
  // Reports content
)}

{activeMenu === 'history' && (
  // History content
)}
```

### Click Handler:
```typescript
<button onClick={() => setActiveMenu('financial')}>
  Financial Manager
</button>
```

---

## 🚀 How to Test

1. **Start the app:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Login as Manager**

3. **Click each sidebar button:**
   - 👥 Field Officer → See farm overview
   - 💰 Financial Manager → See financial data
   - 📊 Reports → See reports table
   - 📈 History → See activity log

4. **Notice the changes:**
   - All cards update
   - Different data displays
   - Different charts appear
   - Layout adapts to content

---

## 📝 Data Sources

### Field Officer:
- `rainfallData` - 12-hour rainfall
- `deviceData` - 5-day device activity
- `cattleBehavior` - 4 activity types
- `notifications` - 3 alerts
- `mapLocations` - 3 GPS points

### Financial:
- `financialData` - 6 months revenue/expenses
- `payments` - 4 recent payments

### Reports:
- `reportsData` - 4 report records

### History:
- `historyData` - 5 activity logs

---

## 🎯 Key Features

✅ **Instant switching** - No page reload
✅ **Smooth transitions** - Cards fade in
✅ **Consistent design** - Same theme across sections
✅ **Real data structure** - Ready for API integration
✅ **Responsive layout** - Works on all screens
✅ **Color-coded** - Easy to identify sections

---

## 💡 Customization

### Add New Section:
1. Add button to sidebar
2. Add data arrays
3. Add conditional block
4. Design card layout

### Change Data:
```typescript
const payments = [
  { id: 1, farmer: 'Your Farmer', amount: 50000, ... }
];
```

### Modify Colors:
Change gradient classes:
```typescript
bg-gradient-to-br from-green-600/30 to-teal-600/30
```

---

## 🔮 Future Enhancements

- [ ] Add filtering options
- [ ] Add search functionality
- [ ] Export data as PDF/Excel
- [ ] Real-time updates via WebSocket
- [ ] User preferences saving
- [ ] Custom date ranges
- [ ] Advanced analytics

---

## 🎉 Summary

**Your dashboard now has 4 completely different views!**

✅ Click sidebar buttons
✅ Content changes instantly
✅ Each section has unique data
✅ Professional design maintained
✅ Ready for real API data

**Test it now and see the magic! ✨**

---

Last Updated: November 8, 2024
Version: Dynamic Content Edition
