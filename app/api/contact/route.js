import { handleContact } from "./submit.mjs";

export async function POST(request) {
  return handleContact(request);
}
