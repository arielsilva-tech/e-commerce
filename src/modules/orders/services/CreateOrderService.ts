import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    if (!customer_id || !products) {
      throw new AppError('Params fault');
    }

    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('customer does not exist');
    }

    const listIdProducts = products.map(product => {
      return { id: product.id };
    });
    const productBDList = await this.productsRepository.findAllById(
      listIdProducts,
    );

    if (productBDList.length < 1) throw new AppError('product does not exist');

    const productsToUpdateQuantity: IUpdateProductsQuantityDTO[] = [];

    const productsToOrder = products.map(product => {
      const index = productBDList.findIndex(value => value.id === product.id);
      // Valid Quantity
      if (productBDList[index].quantity < product.quantity)
        throw new AppError('There are not Quantity enough in the stock');
      // decrement
      productsToUpdateQuantity.push({
        id: product.id,
        quantity: productBDList[index].quantity - product.quantity,
      });
      return {
        product_id: product.id,
        price: productBDList[index].price,
        quantity: product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsToOrder,
    });

    await this.productsRepository.updateQuantity(productsToUpdateQuantity);

    return order;
  }
}

export default CreateOrderService;
