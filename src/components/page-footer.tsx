import { siteConfig } from '@/config/site';

export function PageFooter() {
  return (
    <footer className="py-6 px-4 md:px-6 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p className="mt-1">Powered by Next.js and Genkit.</p>
      </div>
    </footer>
  );
}
