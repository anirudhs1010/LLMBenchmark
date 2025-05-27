import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { Info } from "lucide-react";

export function DisclaimerSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-2">
        <Info className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl">{siteConfig.disclaimer.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.disclaimer.text}
        </p>
      </CardContent>
    </Card>
  );
}
