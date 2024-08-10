import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { redisConfig } from 'src/configs/redis.config';
import { ClusteringService } from 'src/modules/cluster/cluster.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SPEND_SYNC',
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [ClusteringService],
})
export class ClusteringModule {}
