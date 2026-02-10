export const runtime = "edge";

async function edgeAction(formData: FormData) {
  "use server";
  const value = formData.get("value");
  void value;
}

export default function EdgeActionPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Edge Action</h1>
      <form action={edgeAction} className="mt-4 flex flex-col gap-2">
        <input name="value" defaultValue="hello" className="border p-2" />
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Submit
        </button>
      </form>
    </main>
  );
}
