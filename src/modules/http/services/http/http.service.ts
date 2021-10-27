import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import ObjectLiteral from 'src/shared/interfaces/object-literal.interface';

@Injectable()
export class WebookHttpService {
  constructor(
    private readonly httpService: HttpService,
  ) {
    this.httpConfig = {
      timeout: 18000,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: {
        accept: 'application/json',
      },
    };
  }

  private httpConfig;

  async get(url: string, config = {}): Promise<any> {
    try {
      return await this.httpService
        .get(url, Object.assign(this.httpConfig, config))
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  async post(url: string, data: ObjectLiteral, config = {}): Promise<any> {
    try {
      return await this.httpService
        .post(url, Object.assign(data), Object.assign(this.httpConfig, config))
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  async put(url: string, data: ObjectLiteral, config = {}): Promise<any> {
    try {
      return await this.httpService
        .put(url, Object.assign(data), Object.assign(this.httpConfig, config))
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(err) {
    console.log('{ err }, err.message >> ', { err }, err.message);

    throw err;
  }
}
