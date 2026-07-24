import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { guitarLicks, pianoLicks, type Lick } from "@/data/famous-licks";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function LicksTable({ licks, dict }: { licks: Lick[]; dict: Dictionary["famousLicks"] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.columnTitle}</TableHead>
          <TableHead>{dict.columnArtist}</TableHead>
          <TableHead>{dict.columnKey}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {licks.map((lick) => (
          <TableRow key={`${lick.title}-${lick.artist}`}>
            <TableCell>{lick.title}</TableCell>
            <TableCell className="text-muted-foreground">{lick.artist}</TableCell>
            <TableCell>{lick.key}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function FamousLicksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dict.famousLicks.title}</h1>
        <p className="text-sm text-muted-foreground">{dict.famousLicks.subtitle}</p>
      </div>

      <Tabs defaultValue="guitar">
        <TabsList>
          <TabsTrigger value="guitar">{dict.famousLicks.guitarTab}</TabsTrigger>
          <TabsTrigger value="piano">{dict.famousLicks.pianoTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="guitar">
          <LicksTable licks={guitarLicks} dict={dict.famousLicks} />
        </TabsContent>
        <TabsContent value="piano">
          <LicksTable licks={pianoLicks} dict={dict.famousLicks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
