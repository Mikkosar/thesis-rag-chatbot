import { openai } from "@ai-sdk/openai";
import { generateText, tool, stepCountIs, generateObject } from "ai";
import { SearchHits } from "../types/vectorSearchTypes";

import "dotenv/config";
import { findInformation } from "./vectorSearch";
import { ChatMessages } from "../types/chatTypes";

import z from "zod";
import { jsonSchema } from "ai";

/*

export const getChatCompeletion = async (messages: ChatMessages) => {
  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      system: `
        Olet ystävällinen ja avulias ohjaaja erityisopiskelijoille. Vastaat ainoastaan kouluun ja opiskeluun liittyviin kysymyksiin. 
        - Jos kysymys liittyy oppimiseen, opiskeluun tai erityisopiskelijoiden tukemiseen, vastaa hyödyllisesti ja kohteliaasti. 
        - Käytä apuna vain tietokannasta löytyvää tietoa. 
        - Jos et löydä tietoa tai kysymys ei liity kouluun, vastaa kohteliaasti: "Valitettavasti en osaa vastata tähän kysymykseen, koska vastaan vain kouluun liittyvissä asioissa."
        - Vastauksesi tulee olla selkeä, ystävällinen ja helposti ymmärrettävä.
        `,
      tools: {
        getInformation: tool<GetInformationInput, SearchHits>({
          description: "Hae tietoa tietokannasta kysymyksen vastaamista varten",
          inputSchema: getInformationInputSchema,
          execute: async ({ query }) => {
            return findInformation(query);
          },
        }),
      },
      stopWhen: stepCountIs(10),
      messages: messages,
    });
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error("Error generating chat completion");
  }
};


*/

export const getChatCompeletion = async (messages: ChatMessages) => {
  try {
    const result = await generateText({
      model: openai("gpt-4o"),
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
              console.log("Haku laajennetulla kysymyksellä:", q, r);
              results.push(r);
            }
            return results;
          },
        }),
      },
      stopWhen: stepCountIs(10),
      messages: messages,
    });
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error("Error generating chat completion");
  }
};
