import { Request, Response } from 'express';
import { addressService } from '../services/address.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AddressController {
  static createAddress = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const address = await addressService.createAddress(userId, req.body);
    res.status(201).json({ success: true, message: 'Address created successfully', data: address });
  });

  static getAddresses = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const addresses = await addressService.getAddresses(userId);
    res.status(200).json({ success: true, data: addresses });
  });

  static getAddressById = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const address = await addressService.getAddressById(req.params.id, userId);
    res.status(200).json({ success: true, data: address });
  });

  static updateAddress = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const address = await addressService.updateAddress(req.params.id, userId, req.body);
    res.status(200).json({ success: true, message: 'Address updated successfully', data: address });
  });

  static deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    await addressService.deleteAddress(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  });

  static setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const address = await addressService.setDefaultAddress(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Default address updated', data: address });
  });
}