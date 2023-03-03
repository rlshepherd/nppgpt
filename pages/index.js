import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

const prompts = {
  "designerPrompt": "You are a fashion designer choosing your fabrics for your next winter collect. I will provide you with a fabric, and you will compare it with other, different fabcis, and tell us which is more suitable for the winter collection and why.",
  "historianPrompt": "You are a fabric historian assisting a fashion designer. I will provide with the name of a fabric, and please tell me the history of the fabric."
}


export default function Home() {
  const [fabricInput, setFabricInput] = useState("");
  const [result, setResult] = useState();
  const [historianResult, setHistorianResult] = useState();
  const [translationResult, setTranslationResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fabric: fabricInput, prompt: prompts["designerPrompt"] }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    try {
      const historianResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fabric: fabricInput, prompt: prompts["historianPrompt"] }),
      });

      const historianData = await historianResponse.json();
      if (historianResponse.status !== 200) {
        throw data.error || new Error(`Request failed with status ${historianResponse.status}`);
      }

      setHistorianResult(historianData.result);
      setFabricInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    }
  async function onTranslate(event) {
    event.preventDefault();
    try {
      const translationResponse = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"historianResult": historianResult, "designResult": result}),
      });

      const translationData = await translationResponse.json();
      if (translationResponse.status !== 200) {
        throw data.error || new Error(`Request failed with status ${translationResponse.status}`);
      }

      setTranslationResult(translationData.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      // console.error(error);
      alert(error.message);
    }
  }
  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/npp.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/npp.jpg" className={styles.icon} />
        <h3>Write a post for Angie</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="fabric"
            placeholder="Enter a fabric"
            value={fabricInput}
            onChange={(e) => setFabricInput(e.target.value)}
          />
          <input type="submit" value="Generate Post" />
        </form>
        <div >{result}</div>
        <div >{historianResult}</div>
        <form onSubmit={onTranslate}>
        <input type="submit" value="Translate" /> 
        </form>
        <div >{translationResult}</div>
      </main>
    </div>
  );
}