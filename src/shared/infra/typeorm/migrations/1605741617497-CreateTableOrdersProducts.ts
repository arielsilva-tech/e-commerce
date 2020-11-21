import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTableOrdersProducts1605741617497
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );
    // await queryRunner.createForeignKey(
    //   'orders_products',
    //   new TableForeignKey({
    //     name: 'orders_products_fk_products',
    //     columnNames: ['product_id'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'products',
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    //   }),
    // );
    // await queryRunner.createForeignKey(
    //   'orders_products',
    //   new TableForeignKey({
    //     name: 'orders_products_fk_orders',
    //     columnNames: ['order_id'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'orders',
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.dropForeignKey('orders_products', 'order_id');
    // await queryRunner.dropForeignKey('orders_products', 'product_id');

    await queryRunner.dropTable('orders_products');
  }
}
