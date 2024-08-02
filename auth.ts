import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { toast } from "sonner";

import { redirect } from "next/navigation";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Resend({
      from: "santa@realbeardsantas.com",

      // async sendVerificationRequest({
      //   identifier: to,
      //   url,
      //   provider,
      //   request,
      // }) {
      //   const { host } = new URL(url);
      //   const signInUrl = `${host}/signin`; // Construct the sign-in URL

      //   console.log(request);

      //   const res = await fetch("https://api.resend.com/emails", {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${provider.apiKey}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       from: provider.from,
      //       to,
      //       subject: `Sign in to ${host}`,
      //       html: html({ url: signInUrl, host }), // Pass the modified URL here
      //       // html: `<a href=${signInUrl}>Sign in</a>`,
      //       text: text({ url, host }),
      //     }),
      //   });
      //   // console.log(res);
      // },
    }),
  ],

  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        name: user.name,
      },
    }),
    authorized: ({ auth, request }) => {
      console.log(auth, request);
      return true;
    },

    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log(user, account, profile, email, credentials);

      const userData = await prisma.user.findFirst({
        where: { id: user.id },
      });

      console.log(userData);

      if (
        account?.provider === "resend" &&
        email?.verificationRequest === true &&
        !userData
      ) {
        console.log("verficiation");
        return true;
      }
      console.log("yes");
      // redirect("/dashboard/gigs");
      // return true;

      let memberships = await prisma.membership.findMany({
        where: { userId: user.id },
      });
      let organizations = await prisma.organization.findMany({
        where: {
          id: { in: memberships.map((membership) => membership.orgId) },
        },
      });

      console.log(userData, memberships, organizations);
      if (!userData) return true; //we need to return true if its the firs time logging on.
      if (!userData?.isActive) {
        toast.error(
          "Sorry, you don't access to the system. Please email andretru2@gmail.com for assistance.",
        );
        return false;
      }

      //can access as long as its superadmin but has an active account.
      // if (userData.role === "SUPERADMIN") return true;

      //is it a new user? we can determine if memberships and organizations are empty.
      let isNewUser = false;
      if (memberships.length === 0 || organizations.length === 0) {
        isNewUser = true;

        const start = new Date();
        const end = new Date(start.getTime() + 48 * 60 * 60 * 1000);

        try {
          const organization = await prisma.organization.create({
            data: {
              name: userData.name ?? userData.email ?? "",
              trialStartDate: start,
              trialEndDate: end,
              isActive: true,
              createdAt: new Date(),
              createdBy: userData.id,
              updatedAt: new Date(),
              updatedBy: userData.id,
            },
          });

          const membership = await prisma.membership.create({
            data: {
              userId: user.id,
              orgId: organization.id, // Assuming the field is named 'organizationId'
              isActive: true,
              createdAt: new Date(),
              createdBy: userData.id,
              updatedAt: new Date(),
              updatedBy: userData.id,
            },
          });

          memberships = [membership];
          organizations = [organization];
        } catch (error) {
          console.error("Error creating organization or membership:", error);

          return false; // or handle the error in a way that makes sense for your application
        }
      }

      // If you need to use memberships and organizations after this block,
      // make sure they're defined outside of this try-catch block

      //check if it has at least one active membership.
      if (!isNewUser) {
        if (!memberships.some((membership) => membership.isActive === true)) {
          toast.error(
            "Sorry, you don't have access to the system. Please email andretru2@gmail.com for assistance.",
          );
          return false;
        }
        if (!organizations.some((org) => org.isActive === true)) {
          toast.error(
            "Sorry, you don't have access to the system. Please email andretru2@gmail.com for assistance.",
          );
          return false;
        }
      }
      console.log("made it here");
      return true;
      redirect("/dashboard/gigs");

      console.log("exists", userExists);

      return true;

      if (false) {
        if (!user.email) {
          return false;
        }

        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
          select: { name: true },
        });

        if (!userExists) return false;
        // if the user already exists via email,
        // update the user with their name and image from Google

        console.log("login success", user, account, profile);

        await prisma.user.update({
          where: { email: user.email },
          data: {
            name: profile?.name,
          },
        });

        return true;
      }
      return true;
    },
  },
});

function html(params: { url: string; host: string; theme?: string }) {
  const { url, host } = params;

  console.log(url);

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: #f9f9f9;">
    <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
                Sign in to <strong>localhost:3000</strong>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="border-radius: 5px;" bgcolor="#346df1"><a href=${url} target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">Sign
                                in</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
                If you did not request this email you can safely ignore it.
            </td>
        </tr>
    </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
