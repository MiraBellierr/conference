import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="adminhome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="qrscan"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="createannouncement"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
