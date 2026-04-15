import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuroraText } from "@/components/shared/aurora-text";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            <AuroraText as="span" className="text-2xl font-bold">
              {t("title")}
            </AuroraText>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">{t("description")}</p>
          <Button>{t("getStarted")}</Button>
        </CardContent>
      </Card>
    </main>
  );
}
