import bcrypt from "bcrypt"

const salt = Number(process.env.SALT)

export const hash = async (string: string): Promise<string> => {
  return bcrypt.hash(string, salt)
}

export const compareHash = async (
  string: string,
  hashedString: string
): Promise<boolean> => {
  return bcrypt.compare(string, hashedString)
}
