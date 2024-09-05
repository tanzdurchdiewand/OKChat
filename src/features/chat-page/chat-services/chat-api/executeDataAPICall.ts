import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getSession, useSession } from "next-auth/react";
import httpMocks from "node-mocks-http";
import { options } from "../../../auth-page/auth-api";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export async function executeDataAPICall(
  req: any,
  args: { prompt: string },
  threadId: string,
  userMessage: string,
  signal: AbortSignal
) {
  console.log("executeDataAPICall called with prompt:", args.prompt);

  if (!args.prompt) {
    return "No prompt provided";
  }

  let response: AxiosResponse;

  try {
    response = await axios.get(
      "https://app-okp-okcapacity-service-p.azurewebsites.net/api/employees",
      {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiJhcGk6Ly83NzY2NzczYS00MGNlLTRhY2EtOGIzMC04ZGZmYzM2Y2NiYzAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kMGFkNWM3My0wMmVmLTQ0M2MtYjA4Ny1lMjFiODk1M2UwYWMvIiwiaWF0IjoxNzI0OTM1ODczLCJuYmYiOjE3MjQ5MzU4NzMsImV4cCI6MTcyNDk0MDM2NywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhYQUFBQVVNaEsxU2w5ZzBmaEQzRW0vRWYwejlzdVpobVQxa0tKZHRndk1wVGoxN3FYTzh2b0FuOUtHdEphNlM5bVduMlNLeEhaa1BBN05uZkFuemFJTCsxSjhsNlFKYVNPOFJXSko5K1JiM2RuQlRZPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiI3NzY2NzczYS00MGNlLTRhY2EtOGIzMC04ZGZmYzM2Y2NiYzAiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlN0b2NrIiwiZ2l2ZW5fbmFtZSI6Ik5vYWgiLCJpcGFkZHIiOiIxMDkuMTA5LjIwNi4yMjEiLCJuYW1lIjoiTm9haCBTdG9jayIsIm9pZCI6IjJkZThiMWFkLWRjYWYtNDlmOC04MDAxLTA5ZTZmOWY5MjUxOCIsInJoIjoiMC5BUkFBYzF5dDBPOENQRVN3aC1JYmlWUGdyRHAzWm5mT1FNcEtpekNOXzhOc3k4Q1hBQTAuIiwicm9sZXMiOlsiQXBwLlJlYWQiXSwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJGMUEyVjFxZG9tU18zY3ViY29GYm9PLWIydGdoRmQxdVlQZHlpNXBfLUY4IiwidGlkIjoiZDBhZDVjNzMtMDJlZi00NDNjLWIwODctZTIxYjg5NTNlMGFjIiwidW5pcXVlX25hbWUiOiJuc3RAb2JqZWt0a3VsdHVyLmRlIiwidXBuIjoibnN0QG9iamVrdGt1bHR1ci5kZSIsInV0aSI6InRFckxMam5PMGtLaXh2dDdmLThRQUEiLCJ2ZXIiOiIxLjAifQ.OEXUc_1Q4uX9J_TItNUupebKq0fGsQVunutUjAT6EV7hjVOwGY__slxj37I8RxM9SX0gAQVShEXnlr2AJelk_0ny0pr7dc9HEM_dbtTS9pobMC2CKzRTifE_w_egiayJwz-hHtUfO_jUMG54pKG-CaIIPgYXXKCd_l8ty6-rDRWQ_pibiZdWohPP9wfucgYI1Cd1av5mhtDYfaSPRkA8Nboua6kHhAoVugCuOFIPW_iGYg-QJjXqHI0q0Py8yvL0wwNVCng7xVCc0bDt4GOEgkaT8OgG0p59noKdiK5AIidU0T3pCMNfrGHb1c6Z2B-zrCfkwrWFliGyH7_jUylyiQ`,
        },
        timeout: 5000,
      }
    );
  } catch (error) {
    console.error("🔴 error:\n", error);
    return {
      error:
        "There was an error fetching the data: " +
        error +
        "Return this message to the user and halt execution.",
    };
  }

  console.log("response.data", response.data);
  const cutresponse = response.data.map(
    (item: { id: any; name: any; email: any }) => ({
      id: item.id,
      name: item.name,
      email: item.email,
    })
  );

  console.log("cutresponse", cutresponse);
  try {
    const updated_response = {
      data: null,
    };

    return updated_response;
  } catch (error) {
    console.error("🔴 error:\n", error);
    return {
      error:
        "There was an error processing the data: " +
        error +
        "Return this message to the user and halt execution.",
    };
  }
}
