"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import LoginForm from "./login-form";
import VerifyUserForm from "./verify-form";

function _View() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "otp") {
    return <VerifyUserForm />;
  }

  return <LoginForm />;
}

export default function View() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="max-w-[1600px] w-[90%] bg-transparent md:bg-white h-[85%]  shadow-none md:shadow-2xl overflow-hidden flex">
        <div className="hidden md:flex w-1/2 bg-linear-to-br from-indigo-500 to-purple-600 items-center justify-center">
          <div className="w-full aspect-4/3 flex items-center justify-center">
            <DotLottieReact
              src="/auth/animate.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full md:w-1/2 p-0 md:p-10 lg:p-12 2xl:p-16 flex items-center">
          <div className=" h-full w-full  flex flex-col">
            {/* Logo / Brand */}

            <span className="text-sm font-semibold tracking-widest text-muted-foreground">
              YAPPER
            </span>

            <Suspense fallback={<></>}>
              <_View />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
