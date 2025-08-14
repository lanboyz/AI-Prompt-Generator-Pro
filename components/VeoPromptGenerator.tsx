import React, { useState, useCallback, useRef } from 'react';
import { VeoPromptData } from '../types';
import { PromptCard } from './PromptCard';
import { ResultDisplay } from './ResultDisplay';
import { IconDevelopImage, IconDevelopText, IconGenerate, IconReset } from './IconComponents';
import { generateVeoPrompt, developVeoPromptFromText, developVeoPromptFromImage, translatePrompt, generateStructuredEnglishPrompt, generateStructuredEnglishJson, generateStoryPrompt } from '../services/geminiService';

const initialVeoState: VeoPromptData = {
    subjek: '', usia: '', warnaKulit: '', wajah: '', rambut: '', pakaian: '', asal: '', asesoris: '',
    aksi: '', ekspresi: '', tempat: '', waktu: '', gerakanKamera: '', pencahayaan: '', gayaVideo: '',
    kualitasVideo: 'Ultra HD 4K', suasanaVideo: '', suaraMusik: '', kalimatDiucapkan: '', detailTambahan: '',
    negativePrompt: ''
};

export const VeoPromptGenerator: React.FC = () => {
    const [promptIdea, setPromptIdea] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [veoData, setVeoData] = useState<VeoPromptData>(initialVeoState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finalIndonesianPrompt, setFinalIndonesianPrompt] = useState('');
    const [finalEnglishPrompt, setFinalEnglishPrompt] = useState('');
    const [finalStructuredEnglishPrompt, setFinalStructuredEnglishPrompt] = useState('');
    const [finalStructuredJsonPrompt, setFinalStructuredJsonPrompt] = useState('');
    const [finalStoryPrompt, setFinalStoryPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVeoData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleDevelop = async (type: 'text' | 'image') => {
        setLoading(true);
        setError(null);
    
        try {
            if (type === 'text') {
                if (!promptIdea) {
                    setError('Mohon masukkan "Ide Prompt" terlebih dahulu.');
                    setLoading(false);
                    return;
                }
                const developedData = await developVeoPromptFromText(promptIdea);
                setVeoData(developedData);
            } else if (type === 'image') {
                if (!imageFile) {
                    setError('Mohon unggah gambar untuk pengembangan berbasis gambar.');
                    setLoading(false);
                    return;
                }
                const { promptIdea: newPromptIdea, ...restData } = await developVeoPromptFromImage(imageFile);
                setPromptIdea(newPromptIdea);
                setVeoData(restData);
            }
        } catch (err) {
            setError(err instanceof Error ? `Terjadi kesalahan: ${err.message}` : 'Terjadi kesalahan tidak diketahui');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const indonesianPrompt = await generateVeoPrompt(veoData);
            setFinalIndonesianPrompt(indonesianPrompt);

            const [englishPrompt, structuredEnglish, structuredJson, story] = await Promise.all([
                translatePrompt(indonesianPrompt, veoData.kalimatDiucapkan),
                generateStructuredEnglishPrompt(veoData),
                generateStructuredEnglishJson(veoData),
                generateStoryPrompt(veoData)
            ]);
            
            setFinalEnglishPrompt(englishPrompt);
            setFinalStructuredEnglishPrompt(structuredEnglish);
            setFinalStructuredJsonPrompt(structuredJson);
            setFinalStoryPrompt(story);

        } catch (err) {
            setError(err instanceof Error ? `Terjadi kesalahan saat menghasilkan prompt final: ${err.message}` : 'Terjadi kesalahan tidak diketahui');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setPromptIdea('');
        setImageFile(null);
        setVeoData(initialVeoState);
        setError(null);
        setFinalIndonesianPrompt('');
        setFinalEnglishPrompt('');
        setFinalStructuredEnglishPrompt('');
        setFinalStructuredJsonPrompt('');
        setFinalStoryPrompt('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fields: (keyof VeoPromptData)[] = [
        'subjek', 'aksi', 'tempat', 'pakaian', 'asesoris', 'ekspresi', 'rambut', 'wajah', 'usia', 'warnaKulit', 'asal',
        'waktu', 'pencahayaan', 'gerakanKamera', 'gayaVideo', 'kualitasVideo', 'suasanaVideo', 'suaraMusik',
        'kalimatDiucapkan', 'detailTambahan', 'negativePrompt'
    ];
    
    const labels: Record<keyof VeoPromptData, string> = {
        subjek: 'Subjek', usia: 'Usia', warnaKulit: 'Warna Kulit', wajah: 'Wajah', rambut: 'Rambut', pakaian: 'Pakaian',
        asal: 'Asal (Negara)', asesoris: 'Asesoris', aksi: 'Aksi', ekspresi: 'Ekspresi', tempat: 'Tempat', waktu: 'Waktu',
        gerakanKamera: 'Gerakan Kamera', pencahayaan: 'Pencahayaan', gayaVideo: 'Gaya Video', kualitasVideo: 'Kualitas Video',
        suasanaVideo: 'Suasana Video', suaraMusik: 'Suara atau Musik', kalimatDiucapkan: 'Kalimat yang Diucapkan',
        detailTambahan: 'Detail Tambahan', negativePrompt: 'Negative Prompt (Otomatis)'
    };

    const isDevelopTextDisabled = loading || !promptIdea.trim();
    const isGenerateDisabled = loading || !veoData.subjek.trim() || !veoData.aksi.trim();
    const isResettable = promptIdea.trim() !== '' || imageFile !== null || JSON.stringify(veoData) !== JSON.stringify(initialVeoState);

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <PromptCard label="Ide Prompt" name="promptIdea" value={promptIdea} onChange={(e) => setPromptIdea(e.target.value)} placeholder="Contoh: Seekor naga api terbang di atas kota cyberpunk" />
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="image-upload-veo" className="text-sm font-bold text-red-400 font-orbitron">Unggah Gambar (Opsional)</label>
                        <div className="input-decorator input-decorator-red">
                           <input ref={fileInputRef} id="image-upload-veo" type="file" accept="image/*" onChange={handleImageChange} className="w-full cursor-pointer text-sm text-gray-400 bg-gray-900 p-2.5 rounded-lg border-2 border-gray-700 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                        </div>
                    </div>
                    <div className="flex items-end space-x-4">
                        <button onClick={() => handleDevelop('text')} disabled={isDevelopTextDisabled} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:shadow-none">
                            <IconDevelopText className="w-6 h-6"/> Kembangkan dari Teks
                        </button>
                        <button onClick={() => handleDevelop('image')} disabled={loading || !imageFile} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:shadow-none">
                             <IconDevelopImage className="w-6 h-6"/> Kembangkan dari Gambar
                        </button>
                        <button onClick={handleReset} disabled={!isResettable || loading} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-600/50 disabled:shadow-none">
                             <IconReset className="w-6 h-6"/> Reset
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map(field => (
                    <PromptCard key={field} label={labels[field]} name={field} value={veoData[field]} onChange={handleInputChange} placeholder={`Masukkan ${labels[field]}...`} />
                ))}
            </div>

            <div className="text-center pt-6">
                <button onClick={handleGenerate} disabled={isGenerateDisabled} className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-black text-xl py-4 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105 disabled:transform-none disabled:shadow-none">
                   <IconGenerate className="w-8 h-8"/> Hasilkan Prompt Final
                </button>
            </div>

            <ResultDisplay 
                indonesianPrompt={finalIndonesianPrompt} 
                englishPrompt={finalEnglishPrompt} 
                structuredEnglishPrompt={finalStructuredEnglishPrompt}
                structuredJsonPrompt={finalStructuredJsonPrompt}
                storyPrompt={finalStoryPrompt}
                onIndonesianChange={setFinalIndonesianPrompt} 
                loading={loading} 
            />
        </div>
    );
};