import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your VisaPilot account</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
