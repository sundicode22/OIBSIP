import { prisma } from "../configs/index.js";
import {
  AddressCreateInput,
  AddressUpdateInput,
} from "../../generated/prisma/client";

export const getAddressById = async (id: string) => {
  const address = await prisma.address.findUnique({
    where: { id },
  });
  return address;
};

export const createAddress = async (address: AddressCreateInput) => {
  const newAddress = await prisma.address.create({
    data: address,
  });
  return newAddress;
};

export const updateAddress = async (
  id: string,
  address: AddressUpdateInput,
) => {
  const updatedAddress = await prisma.address.update({
    where: { id },
    data: address,
  });
  return updatedAddress;
};

export const deleteAddress = async (id: string) => {
  const deletedAddress = await prisma.address.delete({
    where: { id },
  });

  return deletedAddress;
};

export const getAddressesByUserId = async (userId: string) => {
  const addresses = await prisma.address.findMany({
    where: { userId },
  });
  return addresses;
};
