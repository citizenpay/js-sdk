<div align="center">
    <h1>CitizenPay JavaScript SDK</h1>
    <p>Official SDK for integrating with <a href="https://citizenpay.xyz">CitizenPay</a></p>
</div>

An easy-to-use JavaScript SDK for creating and managing orders through the [CitizenPay](https://citizenpay.xyz) API. This SDK provides TypeScript support and seamless integration for order management functionality.

# Introduction

Welcome to the official JavaScript SDK for [CitizenPay](https://citizenpay.xyz). CitizenPay is a decentralized payment platform that enables merchants and developers to accept cryptocurrency payments through a simple, secure, and user-friendly interface.

This SDK provides:

- **Order Management**: Create and manage orders through the CitizenPay API
- **TypeScript Support**: Full type definitions for better development experience
- **Framework Agnostic**: Works with any JavaScript/TypeScript application

We hope you find this SDK useful, and we're excited to see what you build with it!

# Installation

To install the SDK, run the following command in your terminal:

```bash
npm install --save @citizenpay/sdk
```

Or if you're using yarn:

```bash
yarn add @citizenpay/sdk
```

Or if you're using pnpm:

```bash
pnpm add @citizenpay/sdk
```

# API Reference

## Orders

The orders module provides functionality for creating and managing orders through the CitizenPay API. This is the primary way to integrate payment flows into your application.

### Types

#### `OrderRequest`

Interface for creating a new order:

```typescript
interface OrderRequest {
  /** Base URL for the API endpoint. If not provided, uses https://checkout.citizenpay.xyz */
  baseUrl?: string;
  /** API key for authentication */
  apiKey: string;
  /** Unique identifier for the place/merchant */
  placeId: number;
  /** Total amount for the order (in cents or smallest currency unit) */
  total: number;
  /** Optional description of the order */
  description?: string;
  /** Optional array of items in the order */
  items?: OrderItem[];
}
```

#### `OrderItem`

Interface for individual items within an order:

```typescript
interface OrderItem {
  /** Unique identifier for the item */
  id: number;
  /** Quantity of this item */
  quantity: number;
}
```

### Functions

#### `createOrder(params: OrderRequest): Promise<number>`

Creates a new order through the CitizenPay API. This function sends a POST request to create a new order with the specified details. The order will be associated with a specific place/merchant and can include multiple items with quantities.

**Parameters:**

- `params.baseUrl` - Optional base URL for the API. If not provided, uses https://checkout.citizenpay.xyz
- `params.apiKey` - API key for authentication (required)
- `params.placeId` - Unique identifier for the place/merchant (required)
- `params.total` - Total amount for the order in cents or smallest currency unit (required)
- `params.description` - Optional description of the order
- `params.items` - Optional array of items with their quantities

**Returns:** Promise that resolves to the created order ID

**Throws:** Error when the API request fails (non-2xx response)

**Example:**

```typescript
import { createOrder } from "@citizenpay/sdk";

// Basic order creation
const orderId = await createOrder({
  apiKey: "your-api-key",
  placeId: 12345,
  total: 2500, // $25.00 in cents
  description: "Coffee and pastry",
});

// Order with items
const orderId = await createOrder({
  baseUrl: "https://checkout.citizenpay.xyz",
  apiKey: "your-api-key",
  placeId: 12345,
  total: 5000, // $50.00 in cents
  description: "Restaurant order",
  items: [
    { id: 1, quantity: 2 },
    { id: 3, quantity: 1 },
  ],
});
```

# Building

To build the SDK, run the following command in your terminal:

```bash
npm run build
```

This will compile the TypeScript code to JavaScript.

# Watching for Changes

To automatically recompile the SDK when a file changes, run the following command in your terminal:

```bash
npm run watch
```

# Contributing

We welcome contributions! Please see our contributing guidelines for more details.

# License

This project is licensed under the MIT license.
