export const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];

export function isActiveBooking(status) {
  return ["pending", "confirmed"].includes(status);
}
