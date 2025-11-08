import { Collection, ObjectId } from 'mongodb';
import { Field, FieldInput } from '../models/Field';
import { getDb } from '../config/db';

export class FieldService {
  private collection: Collection<Field>;

  constructor() {
    this.collection = getDb().collection<Field>('fields');
  }

  async create(field: FieldInput): Promise<Field> {
    const newField: any = {
      ...field,
      created_at: field.created_at || new Date(),
      crop_stage: field.crop_stage || 'planting',
      health_status: field.health_status || 'healthy'
    };

    const result = await this.collection.insertOne(newField);
    return { _id: result.insertedId, ...newField };
  }

  async findById(id: string | ObjectId): Promise<Field | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByFarmerId(farmerId: string | ObjectId): Promise<Field[]> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    return await this.collection.find({ farmer_id: objectId }).toArray();
  }

  async findAll(): Promise<Field[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, field: Partial<FieldInput>): Promise<Field | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: field },
      { returnDocument: 'after' }
    );
    return result;
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}