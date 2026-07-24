import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SheetReadingTrainer } from "@/components/sheet-reading/sheet-reading-trainer";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function SheetReadingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dict.sheetReading.title}</h1>
        <p className="text-sm text-muted-foreground">{dict.sheetReading.subtitle}</p>
      </div>

      <SheetReadingTrainer dict={dict.sheetReading} />
    </div>
  );
}
