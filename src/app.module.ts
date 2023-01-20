import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Cat, CatSchema } from './cat.schema';
mongoose.set('debug', true);
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:2mNrPRPse3r9OJKA@cluster0.j4vrt7n.mongodb.net/test123?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
