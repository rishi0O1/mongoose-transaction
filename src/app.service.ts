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
        name: 'name',
        age: 1,
        breed: 'cree',
      });
      await newCat.save({ session });

      const newCat2 = new this.catModel({
        name: 'name',
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
}
