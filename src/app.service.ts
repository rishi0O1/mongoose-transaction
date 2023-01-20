import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'mongodb';
import { Connection, Model, Mongoose, startSession } from 'mongoose';
import { Cat, CatDocument } from './cat.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}

  async onModuleInit() {
    console.log(await this.getHello());
  }

  async getHello() {
    let session;
    try {
      console.log('session starting');
      session = await this.connection.startSession();
      console.log('session started');

      session.startTransaction();
      const newCat = new this.catModel({
        name: 'name2123123',
        age: 1,
        breed: 'cree',
      });
      await newCat.save({ session });

      const newCat2 = new this.catModel({
        name: 'name123',
        age: 1,
        breed: 'cree',
      });
      await newCat2.save({ session });

      await session.commitTransaction();
    } catch (error) {
      console.log('here i am', error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    console.log('check123123');
  }

  async transactionExample2() {
    let transactionSession;
    try {
      transactionSession = await this.connection.startSession();
      await transactionSession.withTransaction(async () => {
        const newCat = new this.catModel({
          name: 'name3',
          age: 1,
          breed: 'cree',
        });
        await newCat.save({ session: transactionSession });

        const newCat2 = new this.catModel({
          name: 'name4',
          age: 1,
          breed: 'cree',
        });
        await newCat2.save({ session: transactionSession });
        throw new Error('adadds');
      });
      await transactionSession.endSession();
      return 'Hello World!';
    } catch (error) {
      console.log(error);
    }
  }
}
