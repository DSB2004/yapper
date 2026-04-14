"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/app/actions/auth/login.action";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/app/actions/user/create.action";
import { upload } from "@/app/actions/uploads/upload.action";
import { useUserStore } from "@/store/user.store";

const schema = z.object({
  firstName: z.string().min(2, "Enter first name"),
  lastName: z.string().min(2, "Enter last name"),
});

type FormData = z.infer<typeof schema>;

export default function CreateAccountForm() {
  const router = useRouter();
  const { refetch } = useUserStore();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleAvatarChange = (file: File) => {
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormData) => {
    try {
      let avatarUrl = "";

      if (avatar) {
        const uploadRes = await upload([avatar]);
        if (uploadRes.success && uploadRes.urls) avatarUrl = uploadRes.urls[0];
      }

      const res = await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: avatarUrl,
      });

      if (!res?.success) {
        toast.error(res?.message || "Something went wrong");
        return;
      }
      refetch();
      router.push(`/`);
    } catch {
      toast.error("Failed to login");
    }
  };

  return (
    <div className="w-full my-auto">
      <div className="space-y-6 mb-10">
        <h2 className="text-5xl font-bold text-gray-900 ">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete your account to use <strong>Yapper</strong>
        </p>
      </div>
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer">
          <div className="w-28 h-28 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-gray-500 text-center px-2">
                Upload
              </span>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleAvatarChange(e.target.files[0])
            }
          />
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <FieldGroup>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <FieldContent>
              <Input {...register("firstName")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <FieldContent>
              <Input {...register("lastName")} />
            </FieldContent>
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
      </form>
    </div>
  );
}
