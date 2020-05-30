import { Logger } from '@overnightjs/logger';
import * as Lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';

const adapter = new FileAsync('db.json');

interface Image {
  friendlyName: string;
}

export default class {
  private db: Lowdb.LowdbAsync<any> | null = null;

  async getAll(): Promise<Image[]> {
    Logger.Info({ category: 'ImageRepository.getAll' }, true);

    return (await this.getImages()).value() || [];
  }

  async remove(friendlyName: string) {
    Logger.Info({ category: 'ImageRepository.remove', friendlyName }, true);

    return (await this.getImages() as any)
      .remove({ friendlyName })
      .write()
      ;
  }

  private async getImages() {
    return (await this.getDb())
      .get('images')
      ;
  }

  private async getDb() {
    return this.db || (this.db = await this.initializeDb());
  }

  private async initializeDb() {
    const db = await Lowdb(adapter);
    await db
      .defaults({ images: [] })
      .write();
    return db;
  }
}
