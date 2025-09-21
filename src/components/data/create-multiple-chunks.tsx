import { useEffect, useState } from "react";
import type { Chunk } from "../../types/chunk";
import Header from "./data-components/dataHeaders";
import Button from "../button";
import DataFormInput from "./data-components/dataFormInput";
import { useNavigate } from "react-router-dom";
import chunkService from "../../services/chunks";
import { useAppDispatch } from "../../hook";
import { createNewChunk } from "../../reducer/data-reducer";

type AiChunk = { chunk: string };

const CreateMultipleChunks = () => {
    const [formData, setFormData] = useState<Partial<Chunk> | undefined>({});
    const [aiChunks, setAiChunks] = useState<AiChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    
    useEffect(() => {
    if (hasGenerated && aiChunks.length === 0) {
        navigate("/");
    }
    }, [aiChunks, hasGenerated, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData?.content || !formData.title) {
            alert("Content and title are required");
            return;
        }
        setIsLoading(true);
        const result = await chunkService.createMultipleChunks(formData?.content || "");
        setAiChunks(result.chunks);
        setHasGenerated(true); // ✅ nyt tiedetään että chunkit on luotu
        setIsLoading(false);
    };

    const handleSaveChunk = async (chunk: AiChunk) => {
        try {
            if (!formData?.title) {
                throw new Error("Title is required");
            }
            dispatch(
                createNewChunk({
                    title: formData.title,
                    content: chunk.chunk,
                })
            );
            // Optionally, you can remove the saved chunk from the list or give feedback to the user
            console.log("Chunk saved:", chunk);
            setAiChunks((prev) => prev.filter((c) => c !== chunk));
        } catch (error) {
            console.error("Error saving chunk:", error);
        }
    };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {isLoading ? (
        <div role="status" className="flex mt-10 items-center justify-center"> 
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/> 
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/> 
            </svg> 
            <span className="sr-only">Loading...</span> 
        </div>
      ) : aiChunks.length > 0 ? (
        <div className="container mx-auto max-w-3xl p-6 flex flex-col">
          <h1 className="font-bold text-black justify-item justify-center flex text-xl mb-4">
            Tekoälyn luomat chunkit
          </h1>
          <ul
            role="list"
            className="grid grid-cols-1 gap-2 divide-y-1 divide-gray-500"
          >
            {aiChunks.map((chunk: AiChunk, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-x-6 py-5 "
              >
                <div className="min-w-0 flex-auto flex flex-col">
                  <p className="text-sm font-semibold text-black">
                    {chunk.chunk}
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    text="Tallenna"
                    onClick={() => handleSaveChunk(chunk)}
                    type="button"
                    color="gray"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <form onSubmit={(e) => handlesSubmit(e)}>
          <div className="space-y-8 bg-white/5 p-8 rounded-2xl shadow-2xl">
            <div className="border-b border-white/10 pb-5 flex flex-col">
              <Header title="Luo useita chunkkeja" />
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <DataFormInput
                  formData={formData ? formData : {}}
                  handleChange={handleChange}
                  label="Title:"
                  placeholder="Esim. Erityisopetus"
                  name="title"
                  text="Title on chunkkien kategorisointia varten. Titlen tulisi olla kuvaava, selkeä ja tekstiin liittyvä."
                  rows={1}
                  value={formData ? formData.title : ""}
                />
                <DataFormInput
                  formData={formData ? formData : {}}
                  handleChange={handleChange}
                  label="Content:"
                  placeholder="Esim. Jos sinulla on pysyvä opiskeluun vaikuttava terveyshaaste..."
                  name="content"
                  text="Liitä tähän se teksti, josta haluat luoda useita chunkkeja. Voit esimerkiksi liittää pitkän tekstin tai dokumentin sisällön. Tekoäly auttaa sinua jakamaan sen ytimekkäisiin osiin."
                  rows={12}
                  value={formData ? formData.content : ""}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <Button type="submit" text="Tallenna" color="green" />
            </div>
          </div>
        </form>
      )}
      <div className="mt-10 flex items-center justify-center">
        <Button
          text="Peruuta"
          color="gray"
          onClick={() => navigate(-1)}
          type="button"
        />
      </div>
    </div>
  );
};

export default CreateMultipleChunks;
