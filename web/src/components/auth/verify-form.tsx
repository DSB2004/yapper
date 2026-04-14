"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "../ui/button";
import { verifyUser } from "@/app/actions/auth/verify.action";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resendOTP } from "@/app/actions/auth/resemd.action";
import { toast } from "sonner";

// ✅ Zod schema
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
});

type FormData = z.infer<typeof otpSchema>;

export default function VerifyUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const {
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otp = watch("otp");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await verifyUser({
        phone,
        otp: data.otp,
      });

      if (!res.success) {
        toast.error(res?.message || "Invalid OTP");
        return;
      }
      router.replace("/");
    } catch {
      toast.error("Verification failed");
    }
  };

  const onResend = async () => {
    try {
      const res = await resendOTP({
        phone,
      });

      if (!res.success) {
        toast.error(res?.message || "Unable to request OTP");
        return;
      }
      toast.info(res?.message || "Unable to request OTP");
    } catch {
      toast.error("Unable to request OTP");
    }
  };
  return (
    <div className="w-full my-auto">
      {/* Heading */}
      <div className="space-y-6 mb-10">
        <h2 className="text-5xl font-bold text-gray-900 ">Verify</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your <strong>OTP</strong> sent to your phone number for
          verification
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <FieldGroup>
          <Field>
            <FieldContent className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setValue("otp", value)}
              >
                <InputOTPGroup className=" gap-2 md:gap-5 w-full  justify-center items-center">
                  <InputOTPSlot
                    index={0}
                    className="md:h-12 h-10 w-10 md:w-12 shadow-2xs rounded-lg border!"
                  />
                  <InputOTPSlot
                    index={1}
                    className="md:h-12 h-10 w-10 md:w-12 shadow-2xs rounded-lg border!"
                  />
                  <InputOTPSlot
                    index={2}
                    className="md:h-12 h-10 w-10 md:w-12 shadow-2xs rounded-lg border!"
                  />
                  <InputOTPSlot
                    index={3}
                    className="md:h-12 h-10 w-10 md:w-12 shadow-2xs rounded-lg border!"
                  />
                  <InputOTPSlot
                    index={4}
                    className="md:h-12 h-10 w-10 md:w-12 shadow-2xs rounded-lg border!"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-12 shadow-2xs rounded-lg border!"
                  />
                </InputOTPGroup>
              </InputOTP>
            </FieldContent>

            {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full h-12 rounded-md   text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Verify OTP"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't recieved the OTP?{" "}
          <button
            type="button"
            onClick={() => onResend()}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Resend
          </button>
        </div>
      </form>
    </div>
  );
}
