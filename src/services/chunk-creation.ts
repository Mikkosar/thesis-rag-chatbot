import { assert } from "@/utils/assert";
import { openai } from "@ai-sdk/openai";
import { generateObject, jsonSchema } from "ai";

export const chunkCreationSchemaJson = jsonSchema<{
  chunks: string[];
}>({
  type: "object",
  properties: {
    chunks: {
      type: "array",
      items: {
        chunk: "string",
      },
    },
  },
  required: ["chunks"],
});


export const createChunks = async (text: string) => {
    const maxChunkSize = 500; // Maksimipituus per chunk

    const result = await generateObject({
        model: openai("gpt-4o"),
        system: `Ensin muunna teksti selkeiksi ja itsenäisiksi propositioiksi: jokaisen lauseen tulee olla itsenäinen ja ymmärrettävä ilman viittauksia pronomineihin (kuten hän, se, ne), vaan käytä aina tarkkaa viittausta. Tämän jälkeen jaa teksti loogisiin ja semanttisesti yhtenäisiin osiin, joissa kukin osa on korkeintaan ${maxChunkSize} merkkiä pitkä. Älä katkaise virkkeitä tai kappaleita kesken. Sijoita samaan osaan vain sellaiset lauseet, jotka käsittelevät samaa teemaa tai aihepiiriä. Jos aihe muuttuu, aloita uusi osa. Pidä huolta, että jokainen osa muodostaa itsenäisen ja ymmärrettävän kokonaisuuden ilman viittauksia muihin osiin. Varmista, että tärkeää tietoa ei katoa chunkkien rajakohdissa.`,
        schema: chunkCreationSchemaJson,
        prompt: text,
    });

    assert(result && result.object && result.object.chunks, 500, "Failed to create chunks");

    return result.object;
}