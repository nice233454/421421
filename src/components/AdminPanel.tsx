import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Save, LogOut, CheckCircle, AlertCircle, Film, User, Phone, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteData } from '../types';

interface Props {
  data: SiteData;
  onLogout: () => void;
  onContentUpdate: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export default function AdminPanel({ data, onLogout, onContentUpdate }: Props) {
  const [form, setForm] = useState<SiteData>({ ...data });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'content' | 'contact'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFormChange(key: keyof SiteData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveContent() {
    setSaveStatus('saving');
    const updates = Object.entries(form).map(([key, value]) =>
      supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' })
    );
    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    setSaveStatus(hasError ? 'error' : 'saved');
    if (!hasError) {
      onContentUpdate();
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }

  async function handleVideoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadError('');

    const ext = file.name.split('.').pop();
    const fileName = `hero-video-${Date.now()}.${ext}`;

    const { data: uploadData, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      setUploadStatus('error');
      setUploadError(error.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(uploadData.path);
    const publicUrl = urlData.publicUrl;

    if (form.video_path && form.video_path !== uploadData.path) {
      await supabase.storage.from('videos').remove([form.video_path]);
    }

    const newForm = { ...form, video_url: publicUrl, video_path: uploadData.path };
    setForm(newForm);

    await supabase.from('site_content').upsert({ key: 'video_url', value: publicUrl }, { onConflict: 'key' });
    await supabase.from('site_content').upsert({ key: 'video_path', value: uploadData.path }, { onConflict: 'key' });

    setUploadProgress(100);
    setUploadStatus('done');
    onContentUpdate();
    setTimeout(() => setUploadStatus('idle'), 4000);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function removeVideo() {
    if (!form.video_path) return;
    await supabase.storage.from('videos').remove([form.video_path]);
    const newForm = { ...form, video_url: '', video_path: '' };
    setForm(newForm);
    await supabase.from('site_content').upsert({ key: 'video_url', value: '' }, { onConflict: 'key' });
    await supabase.from('site_content').upsert({ key: 'video_path', value: '' }, { onConflict: 'key' });
    onContentUpdate();
  }

  const tabs = [
    { id: 'video' as const, label: 'Video', icon: Film },
    { id: 'content' as const, label: 'Content', icon: User },
    { id: 'contact' as const, label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-stone-800 bg-stone-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-black tracking-tight">Admin Panel</h1>
          <p className="text-stone-500 text-xs">Artist Portfolio</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-stone-400 hover:text-white text-sm transition-colors"
          >
            View Site
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex gap-1 mb-8 bg-stone-950 border border-stone-800 rounded-sm p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 ${
                activeTab === id
                  ? 'bg-amber-400 text-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="bg-stone-950 border border-stone-800 rounded-sm p-6">
              <h2 className="text-white font-bold mb-1">Hero Video</h2>
              <p className="text-stone-500 text-sm mb-6">
                Upload a video that will autoplay on the homepage. Recommended: MP4, max 500MB.
              </p>

              {form.video_url && (
                <div className="mb-6 relative rounded-sm overflow-hidden bg-black aspect-video">
                  <video
                    src={form.video_url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeVideo}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                    title="Remove video"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Film size={12} />
                    Current video
                  </div>
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-700 hover:border-amber-400/50 rounded-sm p-10 text-center cursor-pointer transition-colors duration-200 group"
              >
                <Upload className="mx-auto text-stone-600 group-hover:text-amber-400 transition-colors mb-4" size={32} />
                <p className="text-stone-400 group-hover:text-stone-300 transition-colors">
                  {form.video_url ? 'Click to replace video' : 'Click to upload video'}
                </p>
                <p className="text-stone-600 text-xs mt-1">MP4, WebM, MOV — up to 500MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/mov,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />

              {uploadStatus === 'uploading' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${uploadProgress === 0 ? 30 : uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadStatus === 'done' && (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  Video uploaded successfully
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {uploadError || 'Upload failed. Please try again.'}
                </div>
              )}
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-sm p-6">
              <h2 className="text-white font-bold mb-4">Hero Text</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Artist Name</label>
                  <input
                    type="text"
                    value={form.artist_name}
                    onChange={(e) => handleFormChange('artist_name', e.target.value)}
                    className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Tagline</label>
                  <input
                    type="text"
                    value={form.artist_tagline}
                    onChange={(e) => handleFormChange('artist_tagline', e.target.value)}
                    className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-stone-950 border border-stone-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold">About Section</h2>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Section Title</label>
              <input
                type="text"
                value={form.about_title}
                onChange={(e) => handleFormChange('about_title', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Subtitle</label>
              <input
                type="text"
                value={form.about_subtitle}
                onChange={(e) => handleFormChange('about_subtitle', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Bio Text</label>
              <textarea
                rows={6}
                value={form.about_text}
                onChange={(e) => handleFormChange('about_text', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Shows / Announcements</label>
              <textarea
                rows={3}
                value={form.shows_text}
                onChange={(e) => handleFormChange('shows_text', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-stone-950 border border-stone-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold">Contact & Social</h2>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Email</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => handleFormChange('contact_email', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Instagram Handle</label>
              <input
                type="text"
                value={form.contact_instagram}
                onChange={(e) => handleFormChange('contact_instagram', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">Spotify URL</label>
              <input
                type="text"
                value={form.contact_spotify}
                onChange={(e) => handleFormChange('contact_spotify', e.target.value)}
                className="w-full bg-black border border-stone-700 focus:border-amber-400 text-white px-4 py-3 rounded-sm outline-none transition-colors text-sm"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16} />
                Changes saved
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                Failed to save
              </div>
            )}
          </div>
          <button
            onClick={saveContent}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-black font-bold px-6 py-3 rounded-sm transition-colors text-sm tracking-widest uppercase"
          >
            <Save size={16} />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
