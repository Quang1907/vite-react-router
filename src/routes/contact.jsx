import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "not found",
    });
  }
  return { contact };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") == "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <>
      <div id="contact">
        <div>
          <img key={contact.avatar || null} src={contact.avatar || null}></img>
        </div>
        <div>
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}

            <Favorite contact={contact} />
          </h1>

          {contact.facebook && (
            <p>
              <a
                target="_blank"
                href={`https://facebook.com/${contact.facebook}`}
              >
                {contact.facebook}
              </a>
            </p>
          )}

          {contact.notes && <p>{contact.notes}</p>}
          <div id="button">
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                if (!window.confirm("Ban dong y!!")) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();

  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? false : true}
        aria-label={favorite ? "remove from favorite" : "add to favorite"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
