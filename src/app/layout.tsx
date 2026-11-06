import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diwali Digital Diya — A Festival of Light",
  description: "Light a diya, create a rangoli and send a personalised Diwali greeting with Diwali Digital Diya.",
  openGraph: {
    title: "Diwali Digital Diya — A Festival of Light",
    description: "Light a diya, create a rangoli and send a personalised Diwali greeting with Diwali Digital Diya.",
  },
};

export const viewport: Viewport = {
  themeColor: "#39091d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=navigator,c=n.connection||{},q=location.search,l=false;try{l=localStorage.getItem("dd-lite")==="1"}catch(e){}if(q.indexOf("fx=full")>-1){l=false}else if(q.indexOf("fx=lite")>-1||l||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||c.saveData||matchMedia("(prefers-reduced-data: reduce)").matches){l=true}if(l){window.__lite=true;document.documentElement.classList.add("lite")}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
