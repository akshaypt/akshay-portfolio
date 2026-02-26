import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshay Teli",
  description: "Senior Product Manager Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <Script
          id="posthog-init"
          strategy="afterInteractive"
        >
          {`
            !function(t,e){
              var o,n,p,r;
              e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
                function g(t,e){
                  var o=e.split(".");
                  2==o.length&&(t=t[o[0]],e=o[1]),
                  t[e]=function(){
                    t.push([e].concat(Array.prototype.slice.call(arguments,0)))
                  }
                }
                (p=t.createElement("script")).type="text/javascript",
                p.async=!0,
                p.src=s.api_host+"/static/array.js",
                (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
                var u=e;
                void 0!==a?u=e[a]=[]:a="posthog",
                u.people=u.people||[],
                u.toString=function(t){
                  var e="posthog";
                  return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e
                },
                u.people.toString=function(){return u.toString(1)+".people (stub)"},
                o="capture identify alias people.set people.set_once register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset".split(" ");
                for(n=0;n<o.length;n++)g(u,o[n]);
                e._i.push([i,s,a])
              },
              e.__SV=1)
            }(document,window.posthog||[]);
            posthog.init('phc_dCf5qVzEYMa0U1WFXkOPADoLfwynEtgM2DVt7LrojUm',{
              api_host:'https://app.posthog.com'
            });
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
