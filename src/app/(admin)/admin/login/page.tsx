import { loginAction } from "@/lib/actions/admin-auth";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl text-cream">Admin Sign In</h1>
      <p className="mt-2 text-sm text-cream-dim/60">
        SanShuzz &amp; Ma-Shirts house admin.
      </p>

      <form action={loginAction} className="mt-8 space-y-5">
        <input type="hidden" name="from" value={from ?? "/admin"} />
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">Username</label>
          <input
            name="username"
            required
            autoFocus
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">Password</label>
          <input
            type="password"
            name="password"
            required
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-300">Invalid username or password.</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
