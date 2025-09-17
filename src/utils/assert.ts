import CustomError from "@/types/custom-error";

// Assert-funktio, joka heittää CustomErrorin, jos ehto ei täyty
export function assert(
  condition: any,
  status: number,
  message: string
): asserts condition {
  if (!condition) {
    throw new CustomError(status, message);
  }
}
