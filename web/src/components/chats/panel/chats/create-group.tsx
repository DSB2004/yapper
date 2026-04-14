"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { upload } from "@/app/actions/uploads/upload.action";
import { createGroup } from "@/app/actions/group/create.action";
import { toast } from "sonner";
import { useChatroomStore } from "@/store/chatroom.store";
import { useUserStore } from "@/store/user.store";
import { useChatroom } from "@/hooks/chatroom.hook";
import { UserDetails } from "@/types/chatroom";

export default function CreateGroup() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    members: [] as UserDetails[],
  });
  const [uploading, setUploading] = useState(false);
  const {
    data: user,
    isLoading: userLoading,
    isFetching: userFetching,
  } = useUserStore();
  const { data: contacts, isLoading, isFetching } = useChatroomStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMember = (member: UserDetails) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter((m) => m.userId !== member.userId)
        : [...prev.members, member],
    }));
  };
  const { addChatroom } = useChatroom();
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await upload([file]);
      setForm((prev) => ({
        ...prev,
        icon: res.urls?.[0] || "",
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return <></>;
    try {
      const res = await createGroup({
        ...form,
        members: [...form.members.map((ele) => ele.userId), user?.userId],
      });
      if (!res.success) toast.error(res.message);
      else {
        if (user && res.chatroomId && res.groupId) {
          addChatroom({
            chatroomId: res.chatroomId,
            referenceId: res.groupId,
            type: "GROUP",
            name: form.name,
            icon: form.icon,
            description: form.description,
            isActive: true,
            createdBy: {
              avatar: user?.avatar,
              name: `${user.firstName} ${user.lastName}`,
              userId: user.userId,
            },

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            participants: [
              ...form.members,
              {
                avatar: user?.avatar,
                name: `${user.firstName} ${user.lastName}`,
                userId: user.userId,
              },
            ],
            lastMessage: {},
          });
        }
        toast.info(res.message);
      }
    } catch (err) {
      toast.error("Error creating new group");
    }
  };

  const users = contacts?.filter((ele) => ele.type === "PERSONAL") ?? [];
  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <Card className="w-full bg-background border-none py-0! px-0! border-0! ring-0! shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <CardTitle>Create Group</CardTitle>

            <Button type="submit" size="sm">
              Create
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input
              name="name"
              placeholder="Enter group name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Group Image</Label>

            <Input type="file" accept="image/*" onChange={handleImageUpload} />

            {uploading && (
              <p className="text-xs text-muted-foreground">Uploading...</p>
            )}

            {form.icon && (
              <div className="flex items-center gap-3 mt-2">
                <Avatar>
                  <AvatarImage src={form.icon} />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>

                <span className="text-xs text-muted-foreground">
                  Image uploaded
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Group Members</Label>
        {users.length === 0 && (
          <div className="text-center uppercase text-sm text-muted-foreground mx-auto mt-4">
            No chats Found
          </div>
        )}
        {users.map((contact) => {
          const details = contact.participants.find(
            (ele) => ele.userId !== user?.userId,
          );
          if (!details) return <></>;
          const isSelected =
            form.members.find((ele) => ele.userId === details.userId) !== null;
          return (
            <div
              key={details.userId}
              onClick={() => toggleMember(details)}
              className={`flex items-center  border gap-3 p-2 rounded-lg cursor-pointer transition ${
                isSelected
                  ? "bg-muted border-transparent"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Avatar>
                <AvatarImage src={details.avatar} />
                <AvatarFallback>{details.name[0]}</AvatarFallback>
              </Avatar>

              <span className="text-sm">{details.name}</span>
            </div>
          );
        })}
      </div>
    </form>
  );
}
