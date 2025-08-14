
export interface VeoPromptData {
  subjek: string;
  usia: string;
  warnaKulit: string;
  wajah: string;
  rambut: string;
  pakaian: string;
  asal: string;
  asesoris: string;
  aksi: string;
  ekspresi: string;
  tempat: string;
  waktu: string;
  gerakanKamera: string;
  pencahayaan: string;
  gayaVideo: string;
  kualitasVideo: string;
  suasanaVideo: string;
  suaraMusik: string;
  kalimatDiucapkan: string;
  detailTambahan: string;
  negativePrompt: string;
}

export interface ImagenPromptData {
  subjek: string;
  usia: string;
  warnaKulit: string;
  wajah: string;
  rambut: string;
  pakaian: string;
  asal: string;
  asesoris: string;
  aksi: string;
  ekspresi: string;
  tempat: string;
  waktu: string;
  kamera: string;
  pencahayaan: string;
  gaya: string;
  kualitasGambar: string;
  suasanaGambar: string;
  aspekRasio: string;
  detailTambahan: string;
  negativePrompt: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
