import bcrypt from "bcrypt";

export const hashValue = async (val, saltRounds = 10) => {
  return await bcrypt.hash(val, saltRounds);
};

export const compareValue = async (val, hashedValue) => {
  try {
    return await bcrypt.compare(val, hashedValue);
  } catch {
    return false;
  }
};
