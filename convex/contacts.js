// "use client";

// import React from "react";
// import Link from "next/link";
// import { Users, UserPlus } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// export default function ContactsPage() {
//   const people = [
//     { name: "Jack", email: "jack@example.com" },
//     { name: "Roadside Coder", email: "eon55dude@gmail.com" },
//   ];

//   const groups = [
//     { name: "Project Alpha", members: 3 },
//     { name: "Weekend Trip", members: 3 },
//   ];

//   return (
//     <div className="container mx-auto py-10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-5xl font-bold text-green-600">
//           Contacts
//         </h1>

//         <Button className="flex items-center gap-2">
//           <UserPlus className="h-4 w-4" />
//           Create Group
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* PEOPLE */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             People
//           </h2>

//           <div className="flex flex-col gap-4">
//             {people.map((p, index) => (
//               <Card
//                 key={index}
//                 className="hover:bg-muted/40 transition"
//               >
//                 <CardContent className="flex items-center gap-4 py-4">
//                   <Avatar>
//                     <AvatarFallback>
//                       {p.name[0]}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div>
//                     <p className="font-medium">{p.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {p.email}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* GROUPS */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             Groups
//           </h2>

//           <div className="flex flex-col gap-4">
//             {groups.map((g, index) => (
//               <Card
//                 key={index}
//                 className="hover:bg-muted/40 transition"
//               >
//                 <CardContent className="flex items-center gap-4 py-4">
//                   <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
//                     <Users className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="font-medium">{g.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {g.members} members
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all contacts + groups for Contacts page
 * Backend only — NO JSX here
 */
export const getAllContacts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        users: [],
        groups: [],
      };
    }

    // get all users (later we will filter better)
    const users = await ctx.db.query("users").collect();

    return {
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        imageUrl: u.imageUrl,
      })),

      // groups will be added later
      groups: [],
    };
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    memberIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated");

    const userId = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique()
      .then((u) => u?._id);

    if (!userId) throw new Error("User not found");

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      createdBy: userId,
      members: [
        {
          userId,
          role: "admin",
          joinedAt: Date.now(),
        },
        ...args.memberIds.map((id) => ({
          userId: id,
          role: "member",
          joinedAt: Date.now(),
        })),
      ],
    });

    return groupId;
  },
});
