import { Address, IAddress } from '../models/Address';
import { AppError } from '../utils/errors';

class AddressService {
  async createAddress(userId: string, data: Partial<IAddress>): Promise<IAddress> {
    // If this is the user's first address, force it to be default
    const addressCount = await Address.countDocuments({ userId });
    if (addressCount === 0) {
      data.isDefault = true;
    }

    // If this address is set as default, remove default from all other addresses
    if (data.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      ...data,
      userId
    });

    return address;
  }

  async getAddresses(userId: string): Promise<IAddress[]> {
    return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  }

  async getAddressById(id: string, userId: string): Promise<IAddress> {
    const address = await Address.findOne({ _id: id, userId });
    if (!address) {
      throw new AppError(404, 'Address not found');
    }
    return address;
  }

  async updateAddress(id: string, userId: string, data: Partial<IAddress>): Promise<IAddress> {
    const address = await Address.findOne({ _id: id, userId });
    if (!address) {
      throw new AppError(404, 'Address not found');
    }

    if (data.isDefault && !address.isDefault) {
      await Address.updateMany({ userId, _id: { $ne: id } }, { isDefault: false });
    }

    Object.assign(address, data);
    await address.save();
    
    return address;
  }

  async deleteAddress(id: string, userId: string): Promise<void> {
    const address = await Address.findOne({ _id: id, userId });
    if (!address) {
      throw new AppError(404, 'Address not found');
    }

    await address.deleteOne();

    // If the deleted address was the default, make the newest remaining address default
    if (address.isDefault) {
      const newestAddress = await Address.findOne({ userId }).sort({ createdAt: -1 });
      if (newestAddress) {
        newestAddress.isDefault = true;
        await newestAddress.save();
      }
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<IAddress> {
    await Address.updateMany({ userId }, { isDefault: false });
    const address = await this.updateAddress(id, userId, { isDefault: true });
    return address;
  }
}

export const addressService = new AddressService();