import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from './services/services.module';
import { RpcModule } from './rpc/rpc.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('🔥 Connecting to MongoDB:', process.env.DATABASE_URL);
        return {
          uri: process.env.DATABASE_URL,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          minPoolSize: 2,
          heartbeatFrequencyMS: 10000,
          connectionFactory: (connection) => {
            connection.on('connected', () =>
              console.log('✅ Mongoose connected'),
            );
            connection.on('error', (err) =>
              console.error('❌ Mongoose error:', err),
            );
            connection.on('disconnected', () =>
              console.warn('⚠️ Mongoose disconnected'),
            );
            return connection;
          },
        };
      },
    }),

    ServicesModule,
    RpcModule,
  ],
})
export class AppModule {}
