import {
  streamText,
  tool,
  stepCountIs,
  generateObject,
  UIMessage,
  convertToModelMessages,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { SearchHits } from "../types/vectorSearchTypes";

import z from "zod";
import { jsonSchema } from "ai";

import { findInformation } from "./vectorSearch";

export const getStreamText = async (messages: UIMessage[]) => {
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToModelMessages(messages),
    onFinish: () => {
      console.log("Streaming finished.");
    },
    system: `
        Olet ystävällinen ja avulias ohjaaja erityisopiskelijoille. Vastaat ainoastaan kouluun ja opiskeluun liittyviin kysymyksiin.
        Työskentelet yhden toolin kanssa, joka laajentaa käyttäjän alkuperäisen kysymyksen useiksi muunnelmiksi ja hakee tietoa kaikilla niillä.
        - Käytä apuna vain tietokannasta löytyvää tietoa.
        - Jos et löydä tietoa tai kysymys ei liity kouluun, vastaa kohteliaasti: "Valitettavasti en osaa vastata tähän kysymykseen, koska vastaan vain kouluun liittyvissä asioissa."
        - Vastauksesi tulee olla selkeä, ystävällinen ja helposti ymmärrettävä.
        - Palauta lopuksi aina vain valmis vastaus käyttäjälle, älä muuta toolien tuottamaa dataa.
        `,
    tools: {
      expandAndSearch: tool<{ query: string }, SearchHits[]>({
        description:
          "Laajenna kysymys useiksi muunnelmiksi ja hae tietoa kaikilla niillä.",
        inputSchema: jsonSchema({
          type: "object",
          properties: {
            query: { type: "string", description: "Käyttäjän kysymys" },
          },
          required: ["query"],
        }),
        execute: async ({ query }) => {
          const {
            object: { queries },
          } = await generateObject({
            model: openai("gpt-4o"),
            schema: z.object({ queries: z.array(z.string()) }),
            prompt: `Luo seuraavasta kysymyksestä 3:\n\n${query}`,
          });

          const results: SearchHits[] = [];
          for (const q of queries) {
            const r = await findInformation(q);
            results.push(r);
          }
          return results;
        },
      }),
    },
    stopWhen: stepCountIs(10),
  });
  return result;
};
