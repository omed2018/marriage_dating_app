"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { registerUser } from "@/features/auth/actions";
import { registerSchema } from "@/features/auth/schema";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "" as "MALE" | "FEMALE" | "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.gender) {
      setError("Please select your gender");
      return;
    }

    const parsed = registerSchema.safeParse({
      name: form.name,
      email: form.email,
      password: form.password,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const result = await registerUser(parsed.data);
    setLoading(false);

    if (!result.success) {
      setError(result.error!);
    } else {
      router.push("/login?registered=true");
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create Account
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            id="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            required
          />

          <Input
            label="Email"
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="Min. 8 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="Confirm password"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex gap-4">
              {(["MALE", "FEMALE"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-700">
                    {g === "MALE" ? "Male" : "Female"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Date of Birth"
            type="date"
            id="dateOfBirth"
            value={form.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-600 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
