# BinnaCRM - Customer Relationship Management System

## Overview

BinnaCRM is a comprehensive customer relationship management system designed for Saudi Arabian businesses. It provides complete customer lifecycle management, sales automation, marketing tools, and customer service capabilities.

## Features

### Customer Management
- **Complete Customer Profiles** - 360-degree view of customer information
- **Contact Management** - Centralized contact database
- **Customer Segmentation** - Advanced segmentation and targeting
- **Customer Journey Tracking** - Complete interaction history

### Sales Management
- **Lead Management** - Lead capture, qualification, and nurturing
- **Opportunity Pipeline** - Visual sales pipeline management
- **Sales Forecasting** - Predictive sales analytics
- **Quote Management** - Professional quote generation

### Marketing Tools
- **Campaign Management** - Multi-channel marketing campaigns
- **Email Marketing** - Automated email sequences
- **Social Media Integration** - Social media management
- **Analytics & Reporting** - Marketing performance tracking

### Customer Service
- **Support Ticketing** - Integrated help desk system
- **Knowledge Base** - Self-service customer portal
- **Live Chat** - Real-time customer support
- **Customer Feedback** - Satisfaction surveys and feedback

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_APP_NAME=BinnaCRM
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_PORT=3004
DATABASE_URL=your_database_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
The system uses Supabase for data storage. Run the following SQL to set up the required tables:

```sql
-- Customer tables
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(200),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  stage VARCHAR(50) DEFAULT 'prospecting',
  value DECIMAL(15,2),
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

### Starting the Application
```bash
# Development mode (port 3004)
npm run dev

# Production mode
npm run build && npm start
```

### Access Points
- **Dashboard**: `http://localhost:3004/dashboard`
- **Customers**: `http://localhost:3004/customers`
- **Leads**: `http://localhost:3004/leads`
- **Opportunities**: `http://localhost:3004/opportunities`

## API Endpoints

### Customer Management
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Lead Management
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Opportunity Management
- `GET /api/opportunities` - List all opportunities
- `POST /api/opportunities` - Create new opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity

## Deployment

### Standalone Deployment
BinnaCRM can be deployed as a standalone application:

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# Recommended: Vercel, Netlify, or AWS

# For Docker deployment
docker build -t binnacrm .
docker run -p 3004:3004 binnacrm
```

### Integration with Binna Platform
BinnaCRM integrates seamlessly with other Binna products:
- **BinnaPOS** - Customer data sync
- **BinnaStock** - Inventory-based recommendations
- **BinnaBooks** - Financial customer insights
- **BinnaAnalytics** - Advanced CRM analytics

## Saudi Arabia Specific Features

### Localization
- **Arabic Language Support** - Complete RTL interface
- **Saudi Calendar Integration** - Hijri and Gregorian calendars
- **Local Business Hours** - Saudi working hours and holidays
- **Currency Support** - Saudi Riyal (SAR) formatting

### Compliance
- **GDPR Compliance** - Data protection and privacy
- **Saudi Data Laws** - Local data protection requirements
- **Industry Standards** - Saudi business compliance

### Local Integrations
- **Saudi Post Integration** - Address validation
- **SADAD Payment Integration** - Payment processing
- **Government API Integration** - Business verification
- **Local SMS Providers** - SMS marketing capabilities

## Architecture

BinnaCRM follows a modular architecture:
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Supabase with PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## Development

### Project Structure
```
src/
├── app/              # Next.js app router
├── components/       # Reusable components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
└── styles/          # CSS styles
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For technical support and documentation:
- **Documentation**: Available in the `/docs` folder
- **API Reference**: Available at `/api/docs`
- **Support**: Contact support@binna.sa

## License

MIT License - See LICENSE file for details

## Version History

- **v1.0.0** - Initial release with core CRM features
- **v1.1.0** - Added marketing automation
- **v1.2.0** - Enhanced reporting and analytics
- **v1.3.0** - Mobile app support

---

**BinnaCRM** - Transforming customer relationships in Saudi Arabia
