import CustomError from "@/types/customError";

export function assert(condition: any, status: number, message: string): asserts condition {
  if (!condition) {
    throw new CustomError(status, message);
  }
}