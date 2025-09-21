import { useNavigate } from "react-router-dom";
import type { Chunk } from "../../types/chunk";
import { useState } from "react";
import { useAppDispatch } from "../../hook";
import { createNewChunk } from "../../reducer/data-reducer";
import DataFormInput from "./data-components/dataFormInput";
import Button from "../button";
import Header from "./data-components/dataHeaders";

const DataForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Partial<Chunk> | undefined>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tallennetaan:", formData);
    if (!formData || !formData.title || !formData.content) {
      console.error("Form data is incomplete.");
      return;
    }
    dispatch(
      createNewChunk({
        title: formData!.title!,
        content: formData!.content!,
      })
    );
    navigate(`/`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {formData ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-8 bg-white/5 p-8 rounded-2xl shadow-2xl">
            <div className="border-b border-white/10 pb-5 flex flex-col">
              <Header title="Luo uusi Chunk tietokantaan" />
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="flex justify-items-center mb-2">
                  <Button text="AI työkalu" color="gray" onClick={() => navigate("/create-multiple")} type="button" />
                </div>
                <DataFormInput
                  formData={formData}
                  handleChange={handleChange}
                  label="Title:"
                  placeholder="Esim. Erityisopetus"
                  name="title"
                  text="Title on chunkin kategorisointia varten. Titlen tulisi olla kuvaava ja selkeä."
                  rows={1}
                  value={formData.title}
                />
                <DataFormInput
                  formData={formData}
                  handleChange={handleChange}
                  label="Content:"
                  placeholder="Esim. Jos sinulla on pysyvä opiskeluun vaikuttava terveyshaaste, hanki lääkärin lausunto. Tapaaminen: Sovi tapaaminen erityisopettajan kanssa. Keskustele opiskeluun vaikuttavista tekijöistä. Suositus: Erityisopettaja kirjoittaa suosituksen yksilöllisistä järjestelyistä."
                  name="content"
                  text="Hyvä chunkki on itsenäinen, selkeästi rajattu tekstipätkä (yleensä 2-6 virkettä), joka sisältää yhden pääajatuksen."
                  rows={6}
                  value={formData.content}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <Button type="submit" text="Tallenna" color="green" />
            </div>
          </div>
        </form>
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
      <div className="mt-10 flex items-center justify-center">
        <Button text="Peruuta" color="gray" onClick={() => navigate(-1)} type="button" />
      </div>
    </div>
  );
};

export default DataForm;
