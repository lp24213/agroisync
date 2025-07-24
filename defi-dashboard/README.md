# DeFi Dashboard Project

## Overview
The DeFi Dashboard project is a decentralized finance application that allows users to interact with various DeFi pools, view token information, and track Total Value Locked (TVL) using Ethereum smart contracts and APIs. The application is built using React, TypeScript, and Next.js, ensuring a modern and efficient development experience.

## Project Structure
The project is organized into several key directories:

- **components/**: Contains React components for the DeFi dashboard and widgets.
  - **defi/**: Includes the main dashboard component.
  - **widgets/**: Contains reusable components for displaying price information.

- **contexts/**: Holds the global context for sharing DeFi pool data across components.

- **contracts/**: Contains the Solidity smart contract for managing DeFi pools.

- **hooks/**: Includes custom hooks for managing state and data fetching.

- **middlewares/**: Contains middleware for security and request handling.

- **pages/**: Includes API routes for server-side functionality.

- **scripts/**: Contains deployment scripts for the smart contract.

- **services/**: Holds functions for interacting with DeFi services and data retrieval.

- **types/**: Defines TypeScript types and interfaces for type safety.

## Installation
To get started with the DeFi Dashboard project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd defi-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables as needed for your configuration.

## Usage
To run the application in development mode, use the following command:
```
npm run dev
```
This will start the Next.js development server, and you can access the application at `http://localhost:3000`.

## Features
- **DeFi Pools**: View and interact with various DeFi pools.
- **Token Information**: Display token names and their respective TVL.
- **Price Widget**: Fetch and display real-time price data from CoinGecko.
- **Security**: Implemented middlewares for CORS, rate limiting, and security headers.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.