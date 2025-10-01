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
