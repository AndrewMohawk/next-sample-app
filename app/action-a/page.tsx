async function actionA(formData: FormData) {
  "use server";
  const value = formData.get("value");
  void value;
}

export default function ActionAPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Action A</h1>
      <form action={actionA} className="mt-4 flex flex-col gap-2">
        <input name="value" defaultValue="hello" className="border p-2" />
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Submit
        </button>
      </form>
    </main>
  );
}
