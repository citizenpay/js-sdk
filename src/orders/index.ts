export type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "needs_minting"
  | "needs_burning"
  | "refunded"
  | "refund_pending"
  | "refund"
  | "correction";

export interface Order {
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

/**
 * Request parameters for creating a new order
 */
export interface OrderRequest {
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

/**
 * Individual item within an order
 */
export interface OrderItem {
  /** Unique identifier for the item */
  id: number;
  /** Quantity of this item */
  quantity: number;
}

/**
 * Response from the order creation API
 */
export interface OrderResponse {
  /** Unique identifier for the created order */
  orderId: number;
  /** URL-friendly identifier for the order */
  slug: string;
  /** Direct link to the order checkout page */
  link: string;
}

/**
 * Creates a new order through the CitizenPay API
 *
 * This function sends a POST request to create a new order with the specified
 * details. The order will be associated with a specific place/merchant and
 * can include multiple items with quantities.
 *
 * @param params - The order creation parameters
 * @param params.baseUrl - Optional base URL for the API. If not provided, uses https://checkout.citizenpay.xyz
 * @param params.apiKey - API key for authentication (required)
 * @param params.placeId - Unique identifier for the place/merchant (required)
 * @param params.total - Total amount for the order in cents or smallest currency unit (required)
 * @param params.description - Optional description of the order
 * @param params.items - Optional array of items with their quantities
 *
 * @returns Promise that resolves to the order response containing orderId, slug, and link
 *
 * @throws {Error} When the API request fails (non-2xx response)
 *
 * @example
 * ```typescript
 * import { createOrder } from '@citizenpay/sdk';
 *
 * // Basic order creation
 * const order = await createOrder({
 *   apiKey: 'your-api-key',
 *   placeId: 12345,
 *   total: 2500, // $25.00 in cents
 *   description: 'Coffee and pastry'
 * });
 * console.log('Order ID:', order.orderId);
 * console.log('Order slug:', order.slug);
 * console.log('Order link:', order.link);
 *
 * // Order with items
 * const order = await createOrder({
 *   baseUrl: 'https://checkout.citizenpay.xyz',
 *   apiKey: 'your-api-key',
 *   placeId: 12345,
 *   total: 5000, // $50.00 in cents
 *   description: 'Restaurant order',
 *   items: [
 *     { id: 1, quantity: 2 },
 *     { id: 3, quantity: 1 }
 *   ]
 * });
 * console.log('Order created:', order.orderId);
 * ```
 */
export const createOrder = async ({
  baseUrl,
  apiKey,
  placeId,
  total,
  description,
  items,
}: OrderRequest): Promise<OrderResponse> => {
  let url = "https://checkout.citizenpay.xyz/api/v1/partners/orders";
  if (baseUrl) {
    url = `${
      baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
    }api/v1/partners/orders`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ placeId, total, description, items }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create order: ${response.status} ${response.statusText}`
    );
  }
  const order = (await response.json()) as OrderResponse;

  return order;
};

/**
 * Request parameters for getting order status
 */
export interface OrderStatusRequest {
  /** Base URL for the API endpoint */
  baseUrl: string;
  /** API key for authentication */
  apiKey: string;
  /** Unique identifier for the order */
  orderId: number;
}

/**
 * Response from the order status API (legacy interface - use Order instead)
 * @deprecated Use the Order interface returned by getOrder
 */
export interface OrderStatusResponse {
  status: string;
}

/**
 * Retrieves the current status and details of an existing order
 *
 * This function sends a GET request to fetch the complete order information
 * including status, payment details, and transaction information. It's useful
 * for checking payment status, retrieving order details, or monitoring order
 * progress.
 *
 * @param params - The order status request parameters
 * @param params.baseUrl - Base URL for the API endpoint (required)
 * @param params.apiKey - API key for authentication (required)
 * @param params.orderId - Unique identifier for the order (required)
 *
 * @returns Promise that resolves to the complete order object with all details
 *
 * @throws {Error} When the API request fails (non-2xx response) or order is not found
 *
 * @example
 * ```typescript
 * import { getOrder } from '@citizenpay/sdk';
 *
 * // Get order status and details
 * const order = await getOrder({
 *   baseUrl: 'https://checkout.citizenpay.xyz',
 *   apiKey: 'your-api-key',
 *   orderId: 12345
 * });
 *
 * console.log('Order status:', order.status);
 * console.log('Total amount:', order.total);
 * console.log('Transaction hash:', order.tx_hash);
 * console.log('Created at:', order.created_at);
 *
 * // Check if order is completed
 * if (order.status === 'paid') {
 *   console.log('Order has been paid successfully!');
 * } else if (order.status === 'pending') {
 *   console.log('Order is still pending payment');
 * }
 * ```
 */
export const getOrder = async ({
  baseUrl,
  apiKey,
  orderId,
}: OrderStatusRequest): Promise<Order> => {
  const response = await fetch(`${baseUrl}/api/v1/partners/orders/${orderId}`, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get order status: ${response.status} ${response.statusText}`
    );
  }

  const order = (await response.json()) as Order;

  return order;
};
