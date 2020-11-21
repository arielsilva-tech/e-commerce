import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import { json, response } from 'express';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const productFound = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return productFound;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const idList = products.map(product => product.id);
    const productFound = await this.ormRepository.find({
      id: In(idList),
    });

    // const productFound = await this.ormRepository
    //   .createQueryBuilder()
    //   .select('product')
    //   .from(Product, 'product')
    //   .where('product.id IN (:...productIdList)', {
    //     productIdList: products,
    //   })
    //   .getMany();
    return productFound;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const listIdProducts: IFindProducts[] = products.map(function (product) {
      const idProduct: IFindProducts = { id: product.id };
      return idProduct;
    });

    const productsList = await this.findAllById(listIdProducts);

    const productsUpdated = products.map(product => {
      const index = productsList.findIndex(value => value.id === product.id);
      productsList[index].quantity = product.quantity;
      return productsList[index];
    });

    await this.ormRepository.save(productsUpdated);

    return productsUpdated;
  }
}

export default ProductsRepository;
