import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { WebookHttpService } from './services/http/http.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [WebookHttpService],
  exports: [WebookHttpService]
})
export class WebhookHttpModule {}
