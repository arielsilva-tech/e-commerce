import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import AppError from '@shared/errors/AppError';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const orderId = request.params.id;
    const ordersToFind = container.resolve(FindOrderService);
    const order = await ordersToFind.execute({ id: orderId });
    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { customer_id, products } = request.body;
      const createOrder = container.resolve(CreateOrderService);
      const order = await createOrder.execute({ customer_id, products });
      return response.json(order);
    } catch (e) {
      throw new AppError('Error to create order');
    }
  }
}
