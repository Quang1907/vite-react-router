import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  const check = await deleteContact(params.contactId);
  if (!check) throw new Error("oh dang!");
  return redirect("/");
}
