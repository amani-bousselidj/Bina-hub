# BinnaAnalytics - Business Intelligence & Analytics System

## Overview

BinnaAnalytics is a comprehensive business intelligence and analytics system designed for Saudi Arabian businesses. It provides advanced data visualization, reporting, and predictive analytics capabilities to help businesses make data-driven decisions.

## Features

### Business Intelligence
- **Advanced Dashboards** - Interactive and customizable dashboards
- **Real-time Analytics** - Live data monitoring and alerts
- **Data Visualization** - Charts, graphs, and interactive visualizations
- **KPI Tracking** - Key performance indicator monitoring

### Reporting System
- **Automated Reports** - Scheduled report generation
- **Custom Reports** - Build your own reports
- **Export Options** - PDF, Excel, and CSV exports
- **Report Sharing** - Share reports with stakeholders

### Predictive Analytics
- **Sales Forecasting** - Predict future sales trends
- **Customer Analytics** - Customer behavior analysis
- **Market Analysis** - Market trends and opportunities
- **Risk Assessment** - Business risk evaluation

### Data Integration
- **Multi-source Data** - Connect multiple data sources
- **Real-time Sync** - Live data synchronization
- **Data Warehouse** - Centralized data storage
- **API Integration** - Third-party system integration

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
NEXT_PUBLIC_APP_NAME=BinnaAnalytics
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_PORT=3005
DATABASE_URL=your_database_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANALYTICS_SECRET_KEY=your_analytics_secret_key
```

### Database Setup
The system uses Supabase for data storage. Run the following SQL to set up the required tables:

```sql
-- Analytics tables
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_id UUID,
  session_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  source VARCHAR(100),
  properties JSONB
);

-- Dashboards table
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  config JSONB,
  user_id UUID,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  query TEXT,
  parameters JSONB,
  schedule VARCHAR(50),
  format VARCHAR(20) DEFAULT 'pdf',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KPIs table
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  formula TEXT,
  target_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  unit VARCHAR(50),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

### Starting the Application
```bash
# Development mode (port 3005)
npm run dev

# Production mode
npm run build && npm start
```

### Access Points
- **Dashboard**: `http://localhost:3005/dashboard`
- **Reports**: `http://localhost:3005/reports`
- **Analytics**: `http://localhost:3005/analytics`
- **KPIs**: `http://localhost:3005/kpis`

## API Endpoints

### Analytics
- `GET /api/analytics/events` - Get analytics events
- `POST /api/analytics/events` - Create analytics event
- `GET /api/analytics/metrics` - Get business metrics
- `GET /api/analytics/dashboard/:id` - Get dashboard data

### Reports
- `GET /api/reports` - List all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### KPIs
- `GET /api/kpis` - List all KPIs
- `POST /api/kpis` - Create new KPI
- `PUT /api/kpis/:id` - Update KPI
- `DELETE /api/kpis/:id` - Delete KPI

## Deployment

### Standalone Deployment
BinnaAnalytics can be deployed as a standalone application:

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# Recommended: Vercel, Netlify, or AWS

# For Docker deployment
docker build -t binnaanalytics .
docker run -p 3005:3005 binnaanalytics
```

### Integration with Binna Platform
BinnaAnalytics integrates seamlessly with other Binna products:
- **BinnaPOS** - Sales analytics and reporting
- **BinnaStock** - Inventory analytics and optimization
- **BinnaBooks** - Financial analytics and insights
- **BinnaCRM** - Customer analytics and behavior

## Saudi Arabia Specific Features

### Localization
- **Arabic Language Support** - Complete RTL interface
- **Saudi Calendar Integration** - Hijri and Gregorian calendars
- **Local Business Hours** - Saudi working hours and holidays
- **Currency Support** - Saudi Riyal (SAR) formatting

### Compliance
- **GDPR Compliance** - Data protection and privacy
- **Saudi Data Laws** - Local data protection requirements
- **Financial Regulations** - Saudi financial reporting standards

### Local Integrations
- **SAMA Integration** - Saudi central bank data
- **Government APIs** - Economic indicators
- **Local Market Data** - Saudi stock exchange (Tadawul)
- **Industry Benchmarks** - Saudi industry standards

## Architecture

BinnaAnalytics follows a modern data architecture:
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Supabase with PostgreSQL
- **Data Processing**: Real-time analytics engine
- **Visualization**: D3.js and Recharts
- **Storage**: Supabase Storage for reports

## Development

### Project Structure
```
src/
├── app/              # Next.js app router
├── components/       # Reusable components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── charts/          # Chart components
└── styles/          # CSS styles
```

### Chart Components
- **LineChart** - Time series data
- **BarChart** - Categorical data
- **PieChart** - Proportional data
- **ScatterPlot** - Correlation analysis
- **Heatmap** - Density visualization
- **GeoChart** - Geographic data

### Data Processing
- **ETL Pipeline** - Extract, Transform, Load
- **Real-time Processing** - Stream processing
- **Data Validation** - Quality assurance
- **Aggregation** - Data summarization

## Contributing

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

- **v1.0.0** - Initial release with core analytics features
- **v1.1.0** - Added predictive analytics
- **v1.2.0** - Enhanced visualization options
- **v1.3.0** - Real-time dashboard updates

---

**BinnaAnalytics** - Transforming data into insights for Saudi Arabian businesses
