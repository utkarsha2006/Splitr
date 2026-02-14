"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  X
} from "lucide-react"
import { useConvexMutation } from "@/hooks/use-convex-query";
import { describe } from "zod/v4/core";

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

export default function CreateGroupModal({isOpen,onClose,onSuccess}) {
  const [selectedMembers, setSelectedMembers ] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  const router = useRouter();
  const { user, isLoaded } = useUser();

  const currentUser = useQuery(api.users.getCurrentUser);
  const searchResults = useQuery(api.users.searchUsers, { query: searchQuery }); 

  const createGroupMutation = useMutation(api.contacts.createGroup);

  const addMember = (user) => {
    if(!selectedMembers.some((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setCommandOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try{
      const memberIds = selectedMembers.map((m) => m.id);
      const groupId = await createGroupMutation({
        name: data.name,
        description: data.description,
        memberIds: memberIds,
      });

      toast.success("Group created successfully!");
      handleClose();

      if(onSuccess) onSuccess(groupId);
    } catch (error) {
      toast.error("Failed to create group: " + error.message);
    }
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
  };

  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    onClose();
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Group name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="Enter group name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter group description"
              {...register("description")}
            />
          </div>

          {/* Members */}
          <div className="space-y-2">
            <Label>Members</Label>
            <Badge
              variant="secondary"
              className="flex items-center gap-2 w-fit"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span>{user?.fullName} (You)</span>
            </Badge>

            {/*selected members*/}
            {selectedMembers.map((member) => (
            <Badge
              key={member.id}
              variant="secondary"
              className="flex items-center gap-2 w-fit"
            >
              <Avatar className="h-5 w-5 mr-2">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {member.name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
              <button 
              type="button"
              onClick={() => removeMember(member.id)}
              className="ml-2 text-muted-foreground hover:text-foreground"  
              >
                <X className="h-3 w-3"/>
              </button>
            </Badge>
            ))}

            {/*add user to selected members */}
            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  varient="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                >
                  Add member
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start" side="bottom">
                <Command className="max-w-sm rounded-lg border">
  <CommandInput 
      placeholder="Search by name or email..."
      value={searchQuery} 
      onValueChange={setSearchQuery}
      />
  <CommandList>
    <CommandEmpty>
      {searchQuery < 2 ? (
        <p className="py-3 px-4 text-sm text-center text-muted-foreground">
          Type at least 2 characters to search. 
        </p>
      ) : searchResults === undefined ? (
        <p className="py-3 px-4 text-sm text-center text-muted-foreground">
          Searching...
        </p>
      ) : (
        <p className="py-3 px-4 text-sm text-center text-muted-foreground">
          No Users found
        </p>
      )
    }
    </CommandEmpty>
    <CommandGroup heading="Users">
      {searchResults?.map((user) => (
        <CommandItem
          key={user.id}
          value = {user.name + user.email}
          onSelect={() => addMember(user)}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.fullName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col"> 
              <span className="text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedMembers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Add at least one other member to create a group.
            </p>
          )}

          <DialogFooter>
            <button
              type="button"
              varient="outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90"
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

}