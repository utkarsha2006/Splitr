"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Users, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import CreateGroupModal from "./_components/create-group-modal";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContactsPage() {
  const data = useQuery(api.contacts.getAllContacts);

  // ✅ MINIMUM FIX
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");

    if(createGroupParam === "true") {
      setIsCreateGroupModalOpen(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("creteGroup");

      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  // Convex loading state
  if (data === undefined) {
    return (
      <div className="container mx-auto px-6 py-8">
        Loading contacts...
      </div>
    );
  }

  const { users, groups } = data;

  return (
    <div className="container mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-green-600">
          Contacts
        </h1>

        <Button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className="bg-black text-white hover:bg-black/90 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* PEOPLE */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            People
          </h2>

          {users.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-muted-foreground">
                No contacts yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="rounded-xl border hover:shadow-sm transition"
                >
                  <CardContent className="flex items-center gap-4 py-5">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-sm">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* GROUPS */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Groups
          </h2>

          {groups.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-muted-foreground">
                No groups yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="rounded-xl border hover:shadow-sm transition"
                >
                  <CardContent className="flex items-center gap-4 py-5">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="font-medium text-sm">
                        {group.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {group.memberCount} members
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE GROUP MODAL */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSuccess={(groupId) => setIsCreateGroupModalOpen(false)}
      />
    </div>
  );
}
