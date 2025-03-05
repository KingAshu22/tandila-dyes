import SignInForm from "@/components/SignInForm";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#232C65] to-[#1E2433] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignInForm />
                </Suspense>
            </div>
        </div>
    );
}
