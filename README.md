<div align="center">
    <h1>Citizen Pay JavaScript SDK</h1>
    <p>Official SDK for integrating with <a href="https://citizenpay.xyz">Citizen Pay</a></p>
</div>

An easy-to-use JavaScript SDK for creating and managing orders through the [Citizen Pay](https://citizenpay.xyz) API. This SDK provides TypeScript support and seamless integration for order management functionality.

# Introduction

Welcome to the official JavaScript SDK for [Citizen Pay](https://citizenpay.xyz). Citizen Pay is a decentralized payment platform that enables merchants and developers to accept cryptocurrency payments through a simple, secure, and user-friendly interface.

This SDK provides:

- **Order Management**: Create and manage orders through the Citizen Pay API
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

The orders module provides functionality for creating and managing orders through the Citizen Pay API. This is the primary way to integrate payment flows into your application.

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

#### `OrderStatusRequest`

Interface for requesting order status:

```typescript
interface OrderStatusRequest {
  /** Base URL for the API endpoint */
  baseUrl: string;
  /** API key for authentication */
  apiKey: string;
  /** Unique identifier for the order */
  orderId: number;
}
```

#### `Order`

Interface representing a complete order object:

```typescript
interface Order {
  id: number;
  created_at: string;
  completed_at: string | null;
  total: number;
  due: number;
  fees: number;
  place_id: number;
  items: {
    id: number;
    quantity: number;
  }[];
  status: OrderStatus;
  description: string;
  tx_hash: string | null;
  type: "web" | "app" | "terminal" | "system" | null;
  account: string | null;
  payout_id: number | null;
  pos: string | null;
  processor_tx: number | null;
  refund_id: number | null;
  token: string | null;
}
```

#### `OrderStatus`

Type representing possible order statuses:

```typescript
type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "needs_minting"
  | "needs_burning"
  | "refunded"
  | "refund_pending"
  | "refund"
  | "correction";
```

### Functions

#### `createOrder(params: OrderRequest): Promise<OrderResponse>`

Creates a new order through the Citizen Pay API. This function sends a POST request to create a new order with the specified details. The order will be associated with a specific place/merchant and can include multiple items with quantities.

**Parameters:**

- `params.baseUrl` - Optional base URL for the API. If not provided, uses https://checkout.citizenpay.xyz
- `params.apiKey` - API key for authentication (required)
- `params.placeId` - Unique identifier for the place/merchant (required)
- `params.total` - Total amount for the order in cents or smallest currency unit (required)
- `params.description` - Optional description of the order
- `params.items` - Optional array of items with their quantities

**Returns:** Promise that resolves to the order response containing orderId, slug, and link

**Throws:** Error when the API request fails (non-2xx response)

**Example:**

```typescript
import { createOrder } from "@citizenpay/sdk";

// Basic order creation
const order = await createOrder({
  apiKey: "your-api-key",
  placeId: 12345,
  total: 2500, // $25.00 in cents
  description: "Coffee and pastry",
});
console.log("Order ID:", order.orderId);
console.log("Order link:", order.link);

// Order with items
const order = await createOrder({
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
console.log("Order created:", order.orderId);
```

#### `getOrder(params: OrderStatusRequest): Promise<Order>`

Retrieves the current status and details of an existing order. This function sends a GET request to fetch the complete order information including status, payment details, and transaction information. It's useful for checking payment status, retrieving order details, or monitoring order progress.

**Parameters:**

- `params.baseUrl` - Base URL for the API endpoint (required)
- `params.apiKey` - API key for authentication (required)
- `params.orderId` - Unique identifier for the order (required)

**Returns:** Promise that resolves to the complete order object with all details

**Throws:** Error when the API request fails (non-2xx response) or order is not found

**Example:**

```typescript
import { getOrder } from "@citizenpay/sdk";

// Get order status and details
const order = await getOrder({
  baseUrl: "https://checkout.citizenpay.xyz",
  apiKey: "your-api-key",
  orderId: 12345,
});

console.log("Order status:", order.status);
console.log("Total amount:", order.total);
console.log("Transaction hash:", order.tx_hash);
console.log("Created at:", order.created_at);

// Check if order is completed
if (order.status === "paid") {
  console.log("Order has been paid successfully!");
} else if (order.status === "pending") {
  console.log("Order is still pending payment");
}
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
