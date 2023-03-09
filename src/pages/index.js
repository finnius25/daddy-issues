import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState(undefined);
  const [youText, setYouText] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setYouText(promptInput);
      setPromptInput("");
    } catch (error) {
      // error handling logic
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex flex-col items-center justify-center my-10 gap-8">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-6xl font-bold">Daddy Issues</h1>
            <p className="font-light text-gray-400 flex flex-col text-center sm:text-start">
              {`Have daddy issues? Talk about your feelings to your AI father
            figure. Daddy's here to help.`}
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="promptInput"
              placeholder="What's on your mind?"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="active:border-blue-500 px-4 py-2 rounded-xl border-blue-400 border-2"
            />
          </form>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 w-10/12 sm:w-6/12">
        {youText && (
          <div className="flex gap-5">
            <div className="whitespace-nowrap font-bold w-20 flex justify-end px-2">
              You:
            </div>
            {youText}
          </div>
        )}
        {result && (
          <div className="flex gap-5">
            <div className="whitespace-nowrap font-bold w-20 flex justify-end px-2">
              AI Father:
            </div>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
