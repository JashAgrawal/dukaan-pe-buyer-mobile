import { Order } from './order';
import { ApiResponse } from './api';

/**
 * Extended order response type that includes the nested order object
 */
export interface CreateOrderResponse extends ApiResponse<{
  order: Order;
}> {}
