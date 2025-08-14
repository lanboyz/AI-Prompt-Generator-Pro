import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { VeoPromptData, ImagenPromptData } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we assume the key is present.
    // We'll add a check to avoid runtime errors if it's missing.
    console.warn("API Key for Gemini is not configured. The application will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "MISSING_API_KEY" });

// --- Helper Functions ---

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const getResponseJson = (response: GenerateContentResponse) => {
    const text = response.text.trim();
    try {
        // Sometimes the API returns the JSON wrapped in markdown
        const jsonStr = text.replace(/^```json\s*/, '').replace(/```$/, '');
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", text);
        throw new Error("Gagal mem-parsing respons JSON dari AI. Respons tidak valid.");
    }
};

// --- Schema Definitions ---

const veoSchema = {
    type: Type.OBJECT,
    properties: {
        promptIdea: { type: Type.STRING, description: "Ide prompt singkat dalam satu kalimat berdasarkan gambar." },
        subjek: { type: Type.STRING, description: "Karakter atau objek utama." },
        usia: { type: Type.STRING, description: "Usia subjek." },
        warnaKulit: { type: Type.STRING },
        wajah: { type: Type.STRING, description: "Deskripsi detail wajah subjek." },
        rambut: { type: Type.STRING },
        pakaian: { type: Type.STRING, description: "Pakaian yang dikenakan." },
        asal: { type: Type.STRING, description: "Asal negara atau etnisitas subjek." },
        asesoris: { type: Type.STRING },
        aksi: { type: Type.STRING, description: "Aktivitas yang sedang dilakukan subjek." },
        ekspresi: { type: Type.STRING },
        tempat: { type: Type.STRING, description: "Lokasi atau latar belakang." },
        waktu: { type: Type.STRING, description: "Waktu (pagi, malam, golden hour, dll)." },
        gerakanKamera: { type: Type.STRING, description: "Contoh: tracking shot, panning, dolly zoom." },
        pencahayaan: { type: Type.STRING, description: "Contoh: cinematic lighting, rim light, neon glow." },
        gayaVideo: { type: Type.STRING, description: "Contoh: hyper-realistic, anime, fantasy, documentary." },
        kualitasVideo: { type: Type.STRING, description: "Contoh: 4K, 8K, highly detailed." },
        suasanaVideo: { type: Type.STRING, description: "Contoh: mystical, tense, joyful, futuristic." },
        suaraMusik: { type: Type.STRING, description: "Deskripsi efek suara atau musik latar." },
        kalimatDiucapkan: { type: Type.STRING, description: "Jika ada dialog, tulis di sini." },
        detailTambahan: { type: Type.STRING, description: "Detail penting lainnya." },
        negativePrompt: { type: Type.STRING, description: "Hal-hal yang harus dihindari. Contoh: blurry, low quality, deformed hands." },
    }
};

const imagenSchema = {
    type: Type.OBJECT,
    properties: {
        promptIdea: { type: Type.STRING, description: "Ide prompt singkat dalam satu kalimat berdasarkan gambar." },
        subjek: { type: Type.STRING, description: "Karakter atau objek utama." },
        usia: { type: Type.STRING },
        warnaKulit: { type: Type.STRING },
        wajah: { type: Type.STRING },
        rambut: { type: Type.STRING },
        pakaian: { type: Type.STRING },
        asal: { type: Type.STRING },
        asesoris: { type: Type.STRING },
        aksi: { type: Type.STRING },
        ekspresi: { type: Type.STRING },
        tempat: { type: Type.STRING },
        waktu: { type: Type.STRING },
        kamera: { type: Type.STRING, description: "Tipe kamera/lensa. Contoh: Canon EOS R5, 50mm f/1.8." },
        pencahayaan: { type: Type.STRING },
        gaya: { type: Type.STRING, description: "Contoh: photorealistic, watercolor, digital art." },
        kualitasGambar: { type: Type.STRING },
        suasanaGambar: { type: Type.STRING },
        aspekRasio: { type: Type.STRING, enum: ["1:1", "16:9", "9:16", "4:3", "3:4"] },
        detailTambahan: { type: Type.STRING },
        negativePrompt: { type: Type.STRING, description: "Hal-hal yang harus dihindari." },
    }
};


// --- VEO PROMPT FUNCTIONS ---

export const developVeoPromptFromText = async (idea: string): Promise<VeoPromptData> => {
    const prompt = `Anda adalah seorang sutradara dan penulis skenario ahli. Berdasarkan ide singkat ini: "${idea}", kembangkan menjadi detail prompt video yang lengkap. Isi semua kolom dalam format JSON yang diminta dengan kreatif dan detail. Pastikan semua field terisi.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: veoSchema,
        }
    });
    return getResponseJson(response);
};

export const developVeoPromptFromImage = async (image: File): Promise<VeoPromptData & { promptIdea: string }> => {
    const imagePart = await fileToGenerativePart(image);
    const prompt = `Anda adalah seorang sutradara dan penulis skenario ahli. Analisis gambar yang diberikan secara mendalam. Berdasarkan analisis Anda, buatlah ide prompt video yang lengkap dan detail. Isi semua kolom dalam format JSON yang diminta, termasuk "promptIdea" yang merupakan ringkasan singkat dari adegan dalam gambar. Pastikan semua field terisi secara kreatif dan relevan dengan gambar.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [ {text: prompt}, imagePart ] },
        config: {
            responseMimeType: "application/json",
            responseSchema: veoSchema,
        }
    });
    return getResponseJson(response);
};

export const generateVeoPrompt = async (data: VeoPromptData): Promise<string> => {
    const promptData = JSON.stringify(data, null, 2);
    const prompt = `Anda adalah seorang penulis prompt AI generatif yang ahli. Ubah data JSON terstruktur berikut menjadi sebuah paragraf prompt video yang kaya, deskriptif, dan sinematik dalam Bahasa Indonesia. Gabungkan semua elemen secara alami untuk menciptakan visi yang jelas dan menarik.
    
    Data JSON:
    ${promptData}
    
    Contoh output: "Sebuah video sinematik 4K, gerakan kamera panning lambat, menunjukkan seorang wanita pejuang tua dari suku pedalaman Indonesia dengan wajah penuh keriput dan tatapan bijak, mengenakan pakaian tradisional dan hiasan kepala bulu, berdiri sendirian di puncak gunung saat matahari terbit, cahaya keemasan menyinari kabut di lembah di bawahnya, menciptakan suasana yang mistis dan tenang, diiringi suara angin lembut dan musik etnik yang samar."
    
    Hasilkan prompt berdasarkan data yang diberikan.`;

    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
};


// --- IMAGEN PROMPT FUNCTIONS ---

export const developImagenPromptFromText = async (idea: string): Promise<ImagenPromptData> => {
    const prompt = `Anda adalah seorang fotografer dan seniman digital ahli. Berdasarkan ide singkat ini: "${idea}", kembangkan menjadi detail prompt gambar yang lengkap. Isi semua kolom dalam format JSON yang diminta dengan kreatif dan detail. Pastikan semua field terisi.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: imagenSchema,
        }
    });
    return getResponseJson(response);
};

export const developImagenPromptFromImage = async (image: File): Promise<ImagenPromptData & { promptIdea: string }> => {
    const imagePart = await fileToGenerativePart(image);
    const prompt = `Anda adalah seorang fotografer dan seniman digital ahli. Analisis gambar yang diberikan secara mendalam. Berdasarkan analisis Anda, buatlah ide prompt gambar yang lengkap dan detail. Isi semua kolom dalam format JSON yang diminta, termasuk "promptIdea" yang merupakan ringkasan singkat dari adegan dalam gambar. Pastikan semua field terisi secara kreatif dan relevan dengan gambar.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [ {text: prompt}, imagePart ] },
        config: {
            responseMimeType: "application/json",
            responseSchema: imagenSchema,
        }
    });
    return getResponseJson(response);
};

export const generateImagenPrompt = async (data: ImagenPromptData): Promise<string> => {
    const promptData = JSON.stringify(data, null, 2);
    const prompt = `Anda adalah seorang penulis prompt AI generatif yang ahli. Ubah data JSON terstruktur berikut menjadi sebuah paragraf prompt gambar yang kaya, deskriptif, dan visual dalam Bahasa Indonesia. Gabungkan semua elemen secara alami untuk menciptakan visi yang jelas dan menarik.
    
    Data JSON:
    ${promptData}
    
    Contoh output: "Fotografi potret ultra-realistis, close-up, seorang astronot dengan pakaian antariksa putih yang usang sedang duduk santai di kursi pantai di Mars, memegang segelas minuman biru neon, helmnya tergeletak di pasir merah di sebelahnya, menunjukkan wajah lelah namun puas, dengan dua bulan Phobos dan Deimos terlihat di langit jingga yang gelap. Pencahayaan dramatis dari samping, gaya sinematik, kualitas 8K, detail tinggi."

    Hasilkan prompt berdasarkan data yang diberikan.`;

    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
};

// --- STRUCTURED PROMPT FUNCTION ---

export const generateStructuredEnglishPrompt = async (data: VeoPromptData | ImagenPromptData): Promise<string> => {
    const promptData = JSON.stringify(data, null, 2);
    const prompt = `You are an expert translator. Translate both the keys and the values of the following JSON object from Indonesian to English. Format the final output as a human-readable string where each key-value pair is on a new line, like "Key: Value". Do not include keys that have empty strings or null as their value.

JSON Data:
${promptData}

Example output format:
Subject: An old warrior woman from an Indonesian tribe...
Action: Standing alone on a mountain peak...
Camera Movement: Slow panning shot

Translate the provided JSON data into this format.`;

    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
};

// --- STRUCTURED JSON FUNCTION ---

export const generateStructuredEnglishJson = async (data: VeoPromptData | ImagenPromptData): Promise<string> => {
    const promptData = JSON.stringify(data, null, 2);
    const prompt = `You are an expert translator and data formatter. Translate both the keys (into camelCase) and the values of the following JSON object from Indonesian to English. The output MUST be a valid JSON object. Do not include keys in the final JSON if their original values are empty strings or null.

JSON Data:
${promptData}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    // Parse and re-stringify for consistent pretty printing
    const jsonObj = getResponseJson(response);
    return JSON.stringify(jsonObj, null, 2);
};

// --- STORY PROMPT FUNCTION ---

export const generateStoryPrompt = async (data: VeoPromptData | ImagenPromptData): Promise<string> => {
    const promptData = JSON.stringify(data, null, 2);

    const spokenPhrase = 'kalimatDiucapkan' in data ? data.kalimatDiucapkan : '';
    let specialInstruction = '';
    if (spokenPhrase && spokenPhrase.trim() !== '') {
        specialInstruction = `\n\n**CRITICAL INSTRUCTION:** The dialogue/spoken phrase in the JSON data ("${spokenPhrase}") MUST remain in its original Indonesian language within the English storyline. DO NOT translate this specific phrase.`;
    }
    
    const prompt = `You are an expert screenwriter and creative writer. Based on the following single scene data, expand it into a continuous five-act storyline in English. This central scene should act as the story's climax.
    
    Your output must be structured with clear headings for each of the five scenes.

    **Scene 1: Exposition/Inciting Incident:** What events led up to this moment? Introduce the characters and the setting, and present the initial conflict or goal.

    **Scene 2: Rising Action:** Describe the events immediately preceding the main scene. Build tension and anticipation. What obstacles did the characters face?

    **Scene 3: The Main Scene (Climax):** Describe the main scene in rich, cinematic detail based on the provided JSON data. This is the turning point of the story.

    **Scene 4: Falling Action:** What happens immediately after the climax? Describe the direct consequences, the emotional fallout, and the immediate next steps.

    **Scene 5: Resolution:** What is the final outcome? Show the new state of affairs for the characters and their world. Provide a sense of closure.

    Your response MUST be formatted exactly like this, with each scene clearly labeled with a heading and its description on a new line.

    JSON Data for the Main Scene:
    ${promptData}

    Generate the continuous five-scene story prompt in English, following the specified format precisely.${specialInstruction}`;

    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
};


// --- TRANSLATION FUNCTION ---

export const translatePrompt = async (indonesianPrompt: string, spokenPhrase: string): Promise<string> => {
    let prompt;
    if (spokenPhrase && spokenPhrase.trim() !== '') {
        prompt = `Translate the following Indonesian text to English. It is very important that you DO NOT translate the specific phrase enclosed in double quotes.
        Indonesian Text: "${indonesianPrompt}"
        Phrase to keep in Indonesian: "${spokenPhrase}"`;
    } else {
        prompt = `Translate the following Indonesian text to English: "${indonesianPrompt}"`;
    }
    
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
};