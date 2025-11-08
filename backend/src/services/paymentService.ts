import { Collection, ObjectId } from 'mongodb';
import { Payment, PaymentInput } from '../models/Payment';
import { getDb } from '../config/db';

export class PaymentService {
  private collection: Collection<Payment>;

  constructor() {
    this.collection = getDb().collection<Payment>('payments');
  }

  async create(payment: PaymentInput): Promise<Payment> {
    const newPayment: any = {
      ...payment,
      created_at: payment.created_at || new Date(),
      status: payment.status || 'pending'
    };

    const result = await this.collection.insertOne(newPayment);
    return { _id: result.insertedId, ...newPayment };
  }

  async findById(id: string | ObjectId): Promise<Payment | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id: objectId });
  }

  async findByFarmerId(farmerId: string | ObjectId): Promise<Payment[]> {
    const objectId = typeof farmerId === 'string' ? new ObjectId(farmerId) : farmerId;
    return await this.collection.find({ farmer_id: objectId }).toArray();
  }

  async findByStatus(status: 'pending' | 'approved' | 'paid' | 'rejected'): Promise<Payment[]> {
    return await this.collection.find({ status }).toArray();
  }

  async findAll(): Promise<Payment[]> {
    return await this.collection.find().toArray();
  }

  async update(id: string | ObjectId, payment: Partial<PaymentInput>): Promise<Payment | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: payment },
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