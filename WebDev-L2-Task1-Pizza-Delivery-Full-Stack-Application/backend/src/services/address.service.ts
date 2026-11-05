import {
  prisma,
  AddressCreateInput,
  AddressUpdateInput,
} from "../configs";

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
