import { OK, NO_CONTENT, BAD_REQUEST } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

import ImagesRepository from '../repositories/ImagesRepository';

@Controller('api/images')
export default class {
  private repository = new ImagesRepository();

  @Get('')
  private async getAll(req: Request, res: Response) {
    Logger.Info('Get All', true);

    return res.status(OK).json(await this.repository.getAll());
  }

  @Delete(':friendlyName')
  private async delete(req: Request, res: Response) {
    const { friendlyName } = req.params;

    Logger.Info(`Deleting file: ${friendlyName}`, true);
    await this.repository.remove(friendlyName);

    return res.status(NO_CONTENT).json();
  }
}
