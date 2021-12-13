import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.tag = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      return session;
    },
    async signIn({ user, account, profile, credentials }) {
      const signed = await getDoc(doc(db, "users", user.email))
      if(!signed.exists()) {
        console.log(user);
        const { id, name, email, image } = user;
        await setDoc(doc(db, "users", email), {
          name: name,
          image : image,
          id : id,
          createdAt : serverTimestamp()
        });
      }
      return true;
    },
  },
  secret: process.env.JWT_SECRET,
});
