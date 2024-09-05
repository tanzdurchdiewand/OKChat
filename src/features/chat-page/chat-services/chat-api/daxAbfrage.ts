import { OpenAIInstance } from "../../../common/services/openai";
import axios, { AxiosResponse } from "axios";

interface AIQuery {
  summary: string;
  query: string;
}

export const executeCreateDAXQuery = async (
  args: { prompt: string },
  userPrompt: string,
  threadId: string,
  signal: AbortSignal
) => {
  console.log("🟢 Executing SQL query with prompt:", userPrompt, args.prompt);
  const openAI = OpenAIInstance();

  const systemMessage = `Your are a helpful, cheerful database assistant.
  Use the following database schema when creating your answers:

  - dbo.Employee (Abbreviation, AvatarUrl, BusinessCardDescription, BusinessUnitId, CareerLevelId, ConsultingLevel, CreatedOn, Email, EntranceDatePermanentEmployee, EntranceDateTrainee, FirstName, FullTimeEquivalent, Id, IsActive, IsExternal, IsZeitAdmin, LastName, Location, LocationId, MentorId, ModifiedOn, MSAADObjectId, Name, OrganizationUnit, RefId, Salutation, Type, TypeId, Upn, WorkingDaysPerWeek, WorkingHoursPerDay )

  Include column name headers in the query results.

  Always provide your answer in the JSON format below:

 { "summary": "your-summary", "query":  "your-query" }

  In the preceding JSON response, substitute "your-query" with the DAX Query to retrieve the requested data.
  
  Format the query as follows:
  EVALUATE SELECTCOLUMNS(FILTER(Employee, your-filter), "Column1", Employee[Column1], "Column2", Employee[Column2], ...)
  
  Replace "your-filter" with the appropriate filter condition (e.g., Employee[FirstName] = "Noah" && Employee[LastName] = "Stock").
  Replace "Column1", "Column2", etc. with the appropriate column names from the Employee table.
  
  Only include columns that are specifically requested.

  If the resulting query is non-executable, replace "your-query" with NA.
  Do not use any other table or schema.
  Output ONLY JSON.
`;

  const response = await openAI.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: args.prompt,
      },
    ],
  });
  console.log("🟢 Response from AI:", response.choices[0].message.content);
  const { summary, query } = extractAIQuery(response);
  console.log("🟢 Generated SQL query:", query, summary);

  let sqlresponse: AxiosResponse;
  const sqlquery = {
    queries: [
      {
        query: query,
      },
    ],
    serializerSettings: {
      includeNulls: true,
    },
    impersonatedUserName: "nst@objektkultur.de",
  };

  try {
    sqlresponse = await axios.post(
      "https://api.powerbi.com/v1.0/myorg/groups/ea0c4808-6379-44a8-989a-07b3166e1967/datasets/b267a072-978c-48ff-ad20-1a189c271cdc/executeQueries",
      sqlquery,
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDBhZDVjNzMtMDJlZi00NDNjLWIwODctZTIxYjg5NTNlMGFjLyIsImlhdCI6MTcyNTExODMxMywibmJmIjoxNzI1MTE4MzEzLCJleHAiOjE3MjUxMjI1ODQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WEFBQUE2VjZmYjlrUUc1cEpINTd5ZndxVHd0SExKNGpnbHlqdUlTZnhUbms2ZG9jcGU1TFg1VkFnNjVrcWw1MkdGNGVGS2ZvNTBxQ1RCeHA4T0RFVjBKTkJmMGZhL3BtTG9vNHl0OWhicXpUUy8vVT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMThmYmNhMTYtMjIyNC00NWY2LTg1YjAtZjdiZjJiMzliM2YzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJTdG9jayIsImdpdmVuX25hbWUiOiJOb2FoIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOTEuNS41LjkyIiwibmFtZSI6Ik5vYWggU3RvY2siLCJvaWQiOiIyZGU4YjFhZC1kY2FmLTQ5ZjgtODAwMS0wOWU2ZjlmOTI1MTgiLCJwdWlkIjoiMTAwMzIwMDJFMzIxNEM3OCIsInJoIjoiMC5BUkFBYzF5dDBPOENQRVN3aC1JYmlWUGdyQWtBQUFBQUFBQUF3QUFBQUFBQUFBQ1hBQTAuIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgSXRlbS5FeGVjdXRlLkFsbCBJdGVtLkV4dGVybmFsRGF0YVNoYXJlLkFsbCBJdGVtLlJlYWRXcml0ZS5BbGwgSXRlbS5SZXNoYXJlLkFsbCBPbmVMYWtlLlJlYWQuQWxsIE9uZUxha2UuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBSZXBydC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFRlbmFudC5SZWFkLkFsbCBUZW5hbnQuUmVhZFdyaXRlLkFsbCBVc2VyU3RhdGUuUmVhZFdyaXRlLkFsbCBXb3Jrc3BhY2UuR2l0Q29tbWl0LkFsbCBXb3Jrc3BhY2UuR2l0VXBkYXRlLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJrZnRvUC1HYXZxZkdsV0s4WkJTOUZZOFhwZWVRNDFFUG00dTR4U294UWpBIiwidGlkIjoiZDBhZDVjNzMtMDJlZi00NDNjLWIwODctZTIxYjg5NTNlMGFjIiwidW5pcXVlX25hbWUiOiJuc3RAb2JqZWt0a3VsdHVyLmRlIiwidXBuIjoibnN0QG9iamVrdGt1bHR1ci5kZSIsInV0aSI6IjVjUTNZcFBlZTBPOFdCVGE5cDFZQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDI0IiwieG1zX3BsIjoiZGUtREUifQ.TZ8Ma-ml1xq2-trkSLqbt9Hn5u4bQYDj1557-TYJJUz8tp8cYmKCWSRp0cAYog46YEfpDW3KZfSeEzcpUXE1YRChPI2t24Tarc8cbLL9GSTW8i6LfifmLzCUIFKV2ZjlJtA2BOYPFZ6dOgWSly1-Ege21BKfNIYyrmdFsEDtdt42ErehbUScKvtdQw0TnqI4aegSJcv9vxQgF8z24WFcycrr8det3Xaf33JLGA0zPDOmHl9_cZidqjHcAfm62LJhjHFuFEI3dnjJQHwTSgnUuZC7OnJyB-961jFhpZ5Xnj-IoRI5KGLpsNVgk1Ar6vYTZPUZdN3DwXwqHfekwDKx5g`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response data:", sqlresponse.data);
  } catch (error) {
    console.error("🔴 error:\n", error);
    return {
      error:
        "There was an error fetching the data: " +
        error +
        "Return this message to the user and halt execution.",
    };
  }

  const cutresponse = sqlresponse.data;

  console.log("cutresponse", cutresponse);
  try {
    const updated_response = {
      data: cutresponse,
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
};

export function extractAIQuery(chatCompletionsResponse: any): {
  summary: string;
  query: string;
} {
  // Entferne die Markierungen, die den JSON-Code umgeben
  const cleanedContent = chatCompletionsResponse.choices[0].message.content
    .replace("```json", "")
    .replace("```", "");
  // .replace("\\", "");

  // Deserialisiere das JSON zu einem AIQuery-Objekt
  const response: AIQuery = JSON.parse(cleanedContent);

  // Extrahiere die gewünschten Eigenschaften
  const summary = response.summary;
  const query = response.query;

  return { summary, query };
}
