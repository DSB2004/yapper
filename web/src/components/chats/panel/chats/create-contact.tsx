"use client";

import React, { useState } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { createContact } from "@/app/actions/contacts/create.action";
import { toast } from "sonner";
import { useChatroom } from "@/hooks/chatroom.hook";
import { useUserStore } from "@/store/user.store";

// ✅ Zod Schema
const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z.string().optional(),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
});

export default function CreateContact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const { addChatroom } = useChatroom();
  const { data: user, isLoading, isFetching } = useUserStore();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate with Zod
    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);

      return;
    }

    try {
      const res = await createContact(form);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Contact created successfully");
        console.log("details for contact", res.chatroomId, res.contactId);
        const now = Date.now();
        if (user && res.chatroomId && res.contactId) {
          addChatroom({
            chatroomId: res.chatroomId,
            referenceId: res.contactId,
            type: "PERSONAL",
            isActive: true,
            createdBy: {
              avatar: user?.avatar,
              name: `${user.firstName} ${user.lastName}`,
              userId: user.userId,
            },

            createdAt: new Date(now).toISOString(),
            updatedAt: new Date(now).toISOString(),
            participants: res.other
              ? [
                  res.other,
                  {
                    avatar: user?.avatar,
                    name: `${user.firstName} ${user.lastName}`,
                    userId: user.userId,
                  },
                ]
              : [
                  {
                    avatar: user?.avatar,
                    name: `${user.firstName} ${user.lastName}`,
                    userId: user.userId,
                  },
                ],
            unreadCount: 0,
          });
        }
        setForm({ firstName: "", lastName: "", phone: "" });
      }
    } catch (err) {
      toast.error("Error creating new contact");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full bg-background border-none py-0! px-0! border-0! ring-0! shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <CardTitle>Create Contact</CardTitle>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0!">
          <div className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
