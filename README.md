# Investment Portfolio Dashboard

A modern web application for analyzing and visualizing investment portfolio data from CSV files. Built with React, TypeScript, and Vite.

## Features

- 📊 Interactive portfolio dashboard with performance metrics
- 📈 Real-time portfolio value calculations
- 📁 CSV file processing for market prices and transactions
- 💰 Support for multiple account types (ISA, LISA)
- 📱 Responsive design with modern UI components
- 📉 Advanced data visualization using Recharts
- 🎨 Sleek UI with Tailwind CSS and shadcn/ui

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd InvestmentSummaryApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## CSV File Requirements

### Market Prices CSV Format

The market prices CSV file should contain current stock/fund prices with the following columns:

```csv
Code,Stock,Price (pence)
0830906,AXA Global Sustainable Distribution,387
B1XG948,Jupiter UK Mid Cap,250.87
```

### Transactions CSV Format

The transactions CSV file should contain transaction history with the following columns:

```csv
Trade date,Settle date,Reference,Transaction Category,Direction,Description,Quantity,Unit cost (£),Purchase Value (£),Account
15/09/2021,16/09/2021,CARD WEB,Deposit,In,Opening Subscription,0,0,4000,LISA
16/09/2021,22/09/2021,B080710043,Purchase,N/A,Jupiter UK Mid Cap,259.054,3.86,1000,LISA
```

## Features Overview

### Portfolio Overview
- Total portfolio value
- Account-wise breakdown (ISA vs LISA)
- Performance metrics
- Asset allocation visualization

### Holdings Analysis
- Current holdings breakdown
- Asset allocation by type
- Geographic exposure
- Investment style distribution

### Transaction History
- Detailed transaction records
- Transaction type distribution
- Regular saver patterns
- Fee analysis

### File Management
- CSV file upload interface
- Data validation
- Preview functionality
- Error handling

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **CSV Processing**: Papa Parse
- **Date Handling**: date-fns
- **Routing**: React Router

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   ├── FileManagement/
│   ├── HoldingsAnalysis/
│   ├── TransactionHistory/
│   └── common/
├── services/
│   ├── csvService.ts
│   └── portfolioService.ts
├── types/
│   └── index.ts
├── context/
│   └── PortfolioContext.tsx
└── App.tsx
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

The project uses ESLint and TypeScript for code quality and consistency. Please ensure your code follows the established patterns and passes all linting checks before submitting changes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
