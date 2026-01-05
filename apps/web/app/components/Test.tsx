"use client";

import React, { useEffect, useState } from "react";

export const Test = () => {
  const [loading, setLoading] = useState(false);
  const testMe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user");

      const { success, message, data, error } = await res.json();

      console.log(message);
    } catch (error) {
      console.log("Error fetch");
    } finally {
      setLoading(false);
    }
  };

  return <div onClick={testMe}>{loading ? "Testing..." : "Test"}</div>;
};
