import { handleOrderSubmission } from "../src/server/orderService";

export default async function handler(req: any, res: any): Promise<void> {
  await handleOrderSubmission(req, res);
}
