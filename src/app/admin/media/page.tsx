'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Image as ImageIcon, Megaphone, Save, Upload, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMediaConfig, updateLiveConfig, getGallery, uploadGalleryItem } from "./actions";

export default function MediaDashboard() {
  const { toast } = useToast();
  const [config, setConfig] = useState<any>({ court1: '', court2: '', isLive: false, announcement: '' });
  const [gallery, setGallery] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMediaConfig().then(setConfig);
    getGallery().then(setGallery);
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    const res = await updateLiveConfig(config);
    setIsSaving(false);
    toast({ title: "Berhasil", description: res.message, className: "bg-green-600 text-white" });
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await uploadGalleryItem(formData);
    if (res.success) {
        toast({ title: "Upload Berhasil", description: res.message });
        getGallery().then(setGallery); // Refresh
        (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">Media Command Center</h2>
            <p className="text-muted-foreground">Kelola Live Streaming, Galeri, dan Pengumuman Website.</p>
        </div>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="live">
                <Video className="w-4 h-4 mr-2" /> Live Streaming
            </TabsTrigger>
            <TabsTrigger value="gallery">
                <ImageIcon className="w-4 h-4 mr-2" /> Galeri Highlight
            </TabsTrigger>
            <TabsTrigger value="announcement">
                <Megaphone className="w-4 h-4 mr-2" /> Pengumuman
            </TabsTrigger>
        </TabsList>

        {/* TAB 1: LIVE STREAM CONTROL */}
        <TabsContent value="live">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Konfigurasi Siaran</CardTitle>
                        <CardDescription>Masukkan URL Embed YouTube / Twitch.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Status Live Website</Label>
                                <p className="text-xs text-muted-foreground">Aktifkan untuk menampilkan player di Homepage.</p>
                            </div>
                            <Switch 
                                checked={config.isLive} 
                                onCheckedChange={(c) => setConfig({...config, isLive: c})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Link Embed Court 1 (Utama)</Label>
                            <Input 
                                placeholder="https://www.youtube.com/embed/..." 
                                value={config.court1}
                                onChange={(e) => setConfig({...config, court1: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Link Embed Court 2 (Opsional)</Label>
                            <Input 
                                placeholder="https://www.youtube.com/embed/..." 
                                value={config.court2}
                                onChange={(e) => setConfig({...config, court2: e.target.value})}
                            />
                        </div>

                        <Button onClick={handleSaveConfig} disabled={isSaving} className="w-full bg-red-600 hover:bg-red-700">
                            {isSaving ? "Menyimpan..." : "Update Siaran Langsung"}
                        </Button>
                    </CardContent>
                </Card>

                {/* PREVIEW */}
                <Card className="bg-black border-none text-white">
                    <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-gray-400">Preview Tampilan</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center h-64 bg-zinc-900 rounded m-6">
                        {config.court1 ? (
                             <iframe src={config.court1} className="w-full h-full rounded" />
                        ) : (
                            <div className="text-center text-zinc-600">
                                <Video className="w-12 h-12 mx-auto mb-2" />
                                <p>No Signal</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* TAB 2: GALERI HIGHLIGHT */}
        <TabsContent value="gallery">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Upload */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader><CardTitle>Upload Foto Baru</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Judul / Caption</Label>
                                <Input name="title" placeholder="Cth: Semifinal Ganda Putra" required />
                            </div>
                            <div className="space-y-2">
                                <Label>File Gambar</Label>
                                <Input type="file" accept="image/*" required />
                            </div>
                            <Button type="submit" className="w-full">
                                <Upload className="w-4 h-4 mr-2" /> Upload ke Website
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List Galeri */}
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Galeri Aktif</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {gallery.map((item) => (
                                <div key={item.id} className="relative group rounded-lg overflow-hidden border bg-secondary">
                                    {/* Di real app gunakan Next Image */}
                                    <img src={item.url} alt={item.title} className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                        <p className="text-xs font-bold mb-2">{item.title}</p>
                                        <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* TAB 3: PENGUMUMAN */}
        <TabsContent value="announcement">
            <Card>
                <CardHeader>
                    <CardTitle>Running Text / Info Bar</CardTitle>
                    <CardDescription>Teks ini akan muncul di bagian atas website (Sticky Bar).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Isi Pengumuman</Label>
                        <Input 
                            value={config.announcement} 
                            onChange={(e) => setConfig({...config, announcement: e.target.value})}
                            placeholder="Cth: Registrasi ulang dibuka pukul 08.00 di Meja Panitia."
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline">Preview di Web</Button>
                        <Button onClick={handleSaveConfig}>Terbitkan Pengumuman</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
