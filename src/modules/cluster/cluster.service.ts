import { Injectable, OnModuleInit, Get, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Injectable()
export class ClusteringService implements OnModuleInit {
  constructor(@Inject('SPEND_SYNC') private readonly client: ClientProxy) {}

  onModuleInit() {
    this.client.connect().then(() => {});
  }

  // @Get()
  // execute(): Observable<number> {
  //   const pattern = { cmd: 'sum' };
  //   const data = [1, 2, 3, 4, 5];
  //   return this.client.send<number>(pattern, data);
  // }

  // @MessagePattern({ cmd: 'sum' })
  // sum(data: number[]): number {
  //   return (data || []).reduce((a, b) => a + b);
  // }
}
