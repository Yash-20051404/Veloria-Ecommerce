import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { validate } from '../services/validate.middleware';
import { createAddressSchema, updateAddressSchema } from '../utils/address.validator';
import { Role } from '../types';

export const addressRoutes = Router();

addressRoutes.use(authenticate, requireRole(Role.BUYER));

addressRoutes.post('/', validate(createAddressSchema), AddressController.createAddress);
addressRoutes.get('/', AddressController.getAddresses);
addressRoutes.get('/:id', AddressController.getAddressById);
addressRoutes.patch('/:id', validate(updateAddressSchema), AddressController.updateAddress);
addressRoutes.delete('/:id', AddressController.deleteAddress);
addressRoutes.patch('/:id/default', AddressController.setDefaultAddress);