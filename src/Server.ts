import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import ImagesController from './controllers/ImagesController';

export default class extends Server {

  private readonly SERVER_STARTED = 'Example server started on port: ';

  constructor() {
    super(true);
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.setupControllers();
  }

  private setupControllers(): void {
    super.addControllers(new ImagesController());
  }

  public start(port: number): void {
    this.app.get('*', (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}
