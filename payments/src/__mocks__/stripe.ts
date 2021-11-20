import mongoose from "mongoose";
export const stripe = {
  charges: {
    create: jest
      .fn()
      // .mockImplementation((id) => Promise.resolve({ id: id })),
      .mockResolvedValue({ id: new mongoose.Types.ObjectId().toHexString() }),
  },
};
