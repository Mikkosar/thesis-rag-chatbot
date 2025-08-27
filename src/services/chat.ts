import { openai } from "@ai-sdk/openai";
import { generateText, tool, stepCountIs } from "ai";
import {
  SearchHits,
  GetInformationInput,
  getInformationInputSchema,
} from "../types/vectorSearchTypes";

import "dotenv/config";
import { findInformation } from "./vectorSearch";
import { ChatMessages } from "../types/chatTypes";

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
