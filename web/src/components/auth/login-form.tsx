"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "../ui/button";
import { loginUser } from "@/app/actions/auth/login.action";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(10, "Enter a valid phone number")
    .regex(/^\d+$/, "Only numbers allowed"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser({ phone: data.phone });

      if (!res?.success) {
        toast.error(res?.message || "Something went wrong");
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("view", "otp");
      params.set("phone", data.phone);

      router.push(`?${params.toString()}`);
    } catch {
      toast.error("Failed to login");
    }
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <div className="w-full my-auto">
      {/* Heading */}
      <div className="space-y-6 mb-10">
        <h2 className="text-5xl font-bold ">Log In</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your phone number to continue using <strong>Yapper</strong>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-5 w-full"
      >
        <FieldGroup>
          <Field>
            <FieldLabel className="text-sm text-muted-foreground">
              Phone Number
            </FieldLabel>
            <FieldContent>
              <Input
                type="tel"
                placeholder="Enter phone number"
                className={`h-12 rounded-md border ${
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border"
                }`}
                {...register("phone")}
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        {/* Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-md  text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
      </form>
    </div>
  );
}
