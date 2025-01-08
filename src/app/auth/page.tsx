/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
export default function Page() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tryLogin = async () => {
    setLoading(true);
    setError("");
    const response = await fetch(
      `/api/getSessionToken?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`
    );
    if (response.ok) {
      const data = await response.json();
      storeAuthToken(data.token);
      storeAuthCredentials(credentials);
      setLoading(false);
    } else {
      setError((await response.json()).error);
      setLoading(false);
      setTimeout(() => setError(""), 6000);
    }
  };

  const storeAuthCredentials = (credentials: {
    username: string;
    password: string;
  }) => {
    localStorage.setItem("authCredentials", JSON.stringify(credentials));
  };

  const storeAuthToken = (token: string) => {
    localStorage.setItem("authToken", token);
    router.push("/");
  };

  // Check if user is already authed
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      router.push("/");
    }
    if (localStorage.getItem("authCredentials")) {
      const credentials = JSON.parse(
        localStorage.getItem("authCredentials") as string
      );
      setCredentials(credentials);
    }
  }, []);

  return (
    <div className="flex mx-4 flex-col items-center justify-center gap-8 min-h-[calc(100svh-60px)]">
      <div className="text-left">
        <h1 className="font-semibold text-2xl">Autenticati</h1>
        <p className="">
          Insersci le tue credenziali classeviva (genitore), non vengono salvate
          sui nostri server.
        </p>
      </div>
      <form
        className="flex flex-col gap-2 w-full max-w-4xl"
        onSubmit={async (e) => {
          e.preventDefault();
          await tryLogin();
        }}
      >
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials({ ...credentials, username: e.target.value });
          }}
          value={credentials.username}
          type="text"
          placeholder="Nome utente"
          name="username"
          autoComplete="username"
        />
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials({ ...credentials, password: e.target.value });
          }}
          value={credentials.password}
          type="password"
          placeholder="Password"
          name="password"
          autoComplete="current-password"
        />
        {error && <span className="text-red-600 text-sm">{error}</span>}
        <Button
          type="submit"
          className="mt-2.5"
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            "Entra"
          )}
        </Button>
      </form>
    </div>
  );
}
