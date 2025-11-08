# Dashboard Structure Documentation

## Overview
This document describes the restructured dashboard system for the Farmer Management Information System. Each stakeholder role now has a dedicated, tailored dashboard with role-specific features and functionality.

## Architecture

### Folder Structure
```
frontend/src/components/dashboards/
├── common/
│   ├── DashboardLayout.tsx    # Shared layout component
│   └── StatCard.tsx            # Reusable stat card component
├── FarmerDashboard.tsx         # Farmer-specific dashboard
├── FieldOfficerDashboard.tsx   # Field Officer dashboard
├── FinanceDashboard.tsx        # Finance Manager dashboard
├── ManagerDashboard.tsx        # Manager dashboard
└── index.ts                    # Export barrel file
```

## Stakeholder Dashboards

### 1. Farmer Dashboard
**Role**: `farmer`
**Focus**: Personal farm management

#### Features:
- **Overview Tab**
  - Recent activity feed
  - Upcoming tasks and reminders
  - Quick stats (fields, harvests, earnings)

- **Fields Tab**
  - List of all fields
  - Growth progress tracking
  - Field health status
  - Crop information

- **Harvests Tab**
  - Recent harvest history
  - Quantity and values
  - Sale status

- **Payments Tab**
  - Payment history
  - Pending payments
  - Transaction details

#### Key Metrics:
- Total Fields
- Total Harvests
- Total Earnings
- Pending Payments

---

### 2. Field Officer Dashboard
**Role**: `field_officer`
**Focus**: Farmer supervision and field inspections

#### Features:
- **Overview Tab**
  - Active alerts requiring attention
  - Upcoming scheduled inspections
  - Quick access to critical issues

- **Farmers Tab**
  - List of assigned farmers
  - Search and filter functionality
  - Farmer status and health ratings
  - Last visit dates

- **Inspections Tab**
  - Schedule new inspections
  - View scheduled inspections
  - Complete inspection records
  - Priority levels

- **Reports Tab**
  - Create inspection reports
  - View recent reports
  - Detailed findings documentation

#### Key Metrics:
- Total Farmers Assigned
- Pending Inspections
- Completed Inspections
- Active Alerts

---

### 3. Finance Dashboard
**Role**: `finance`
**Focus**: Payment processing and financial management

#### Features:
- **Overview Tab**
  - Pending payment approvals
  - Recent transactions
  - Payment summary charts
  - Quick approval actions

- **Payments Tab**
  - All payment records
  - Filter by status
  - Export functionality
  - Payment methods tracking

- **Transactions Tab**
  - Complete transaction history
  - Income and expense tracking
  - Category-based filtering

- **Reports Tab**
  - Generate financial reports
  - Monthly, quarterly, annual summaries
  - Export to PDF/Excel

#### Key Metrics:
- Total Payments Processed
- Pending Payment Amount
- Completed Payments
- Processing Queue

---

### 4. Manager Dashboard
**Role**: `manager`
**Focus**: System-wide oversight and analytics

#### Features:
- **Overview Tab**
  - Recent system activities
  - System alerts and notifications
  - Performance metrics
  - Quick stats overview

- **Analytics Tab**
  - Revenue vs Expenses charts
  - Crop distribution analysis
  - Trend analysis
  - Visual data representations

- **Farmers Tab**
  - Top performing farmers
  - Farmer rankings
  - Performance ratings
  - Revenue contributions

- **Financial Tab**
  - Comprehensive financial summary
  - Income and expense breakdown
  - Profit margins
  - Financial health indicators

#### Key Metrics:
- Total Farmers in System
- Total Harvests
- Total Revenue
- Active Field Officers

---

## Shared Components

### DashboardLayout
A common layout wrapper that provides:
- Consistent header with logo and branding
- User profile display
- Notifications bell
- Settings access
- Logout functionality
- Responsive navigation

**Props:**
- `children`: ReactNode - Dashboard content
- `title`: string - Dashboard page title
- `role`: string - User role for display

### StatCard
Reusable statistics card component for displaying key metrics.

**Props:**
- `title`: string - Metric name
- `value`: string | number - Metric value
- `icon`: LucideIcon - Icon component
- `iconColor`: string - Icon color class
- `iconBgColor`: string - Icon background color class
- `trend`: object (optional) - Trend indicator
  - `value`: string - Trend percentage
  - `isPositive`: boolean - Trend direction
- `subtitle`: string (optional) - Additional info

---

## Routing Logic

The main `Dashboard.tsx` component routes users to their role-specific dashboard:

```typescript
switch (user.role) {
  case 'farmer':
    return <FarmerDashboard />;
  case 'field_officer':
    return <FieldOfficerDashboard />;
  case 'finance':
    return <FinanceDashboard />;
  case 'manager':
    return <ManagerDashboard />;
  default:
    return <UnknownRoleError />;
}
```

---

## Design Principles

1. **Role-Based Access**: Each dashboard shows only relevant information for that role
2. **Consistent UI**: Shared components ensure visual consistency
3. **Responsive Design**: All dashboards work on desktop, tablet, and mobile
4. **Data-Driven**: Mock data structure ready for API integration
5. **Modular**: Easy to extend with new features
6. **User-Friendly**: Intuitive navigation and clear information hierarchy

---

## Future Enhancements

### Planned Features:
- [ ] Real-time data updates
- [ ] Advanced filtering and search
- [ ] Data export functionality
- [ ] Customizable dashboard widgets
- [ ] Role-based permissions system
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app version

### API Integration Points:
- [ ] Connect to farmer service
- [ ] Connect to field service
- [ ] Connect to harvest service
- [ ] Connect to payment service
- [ ] Connect to report service
- [ ] WebSocket for real-time updates

---

## Usage

### For Developers:

1. **Import Dashboard Components:**
```typescript
import { 
  FarmerDashboard, 
  FieldOfficerDashboard, 
  FinanceDashboard, 
  ManagerDashboard 
} from './components/dashboards';
```

2. **Use Shared Components:**
```typescript
import { DashboardLayout, StatCard } from './components/dashboards';
```

3. **Add New Tab:**
```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'newTab'>('overview');
```

### For Users:

1. **Login** with your credentials
2. System automatically routes you to your role-specific dashboard
3. Navigate using the **tab menu** at the top
4. Use **action buttons** to perform tasks
5. Access **notifications** and **settings** from the header

---

## Testing Accounts

For testing different dashboards, create accounts with these roles:
- Farmer: `role: 'farmer'`
- Field Officer: `role: 'field_officer'`
- Finance Manager: `role: 'finance'`
- Manager: `role: 'manager'`

---

## Support

For questions or issues with the dashboard system, please contact the development team.

Last Updated: November 8, 2024
