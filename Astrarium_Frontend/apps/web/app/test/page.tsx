"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      setBackendStatus(`✅ Connected! ${data.message}`);
    } catch (error) {
      setBackendStatus(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const testEmail = `test${Date.now()}@test.com`;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          username: "TestUser",
          password: "testpass123",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBackendStatus(`✅ Registration successful! Token: ${data.access_token?.substring(0, 20)}...`);
      } else {
        const errorText = await response.text();
        setBackendStatus(`❌ Registration failed: ${errorText}`);
      }
    } catch (error) {
      setBackendStatus(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Backend Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </p>
              <p className="rounded-lg bg-muted p-3">
                Status: {backendStatus}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={testBackendConnection} disabled={loading}>
                Test Connection
              </Button>
              <Button onClick={testRegister} disabled={loading}>
                Test Registration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(
                {
                  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
                  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
                },
                null,
                2
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
