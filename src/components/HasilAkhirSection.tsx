import React, { useRef, useState } from 'react';
import { 
  FileText, ArrowLeft, Download, Copy, Check, Loader2, Sparkles, 
  Settings, Printer, RefreshCw, Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, BookOpen, ClipboardList
} from 'lucide-react';

interface HasilAkhirSectionProps {
  compiledModule: any;
  editedHtml: string;
  setEditedHtml: (html: string) => void;
  editedLkpdHtml: string;
  setEditedLkpdHtml: (html: string) => void;
  editedBahanAjarHtml: string;
  setEditedBahanAjarHtml: (html: string) => void;
  onCompile: () => void;
  onCopy: (activeTab: string) => void;
  onDownloadHtml: (activeTab: string) => void;
  onDownloadWord: (activeTab: string) => void;
  onDownloadPdf: (activeTab: string) => void;
  downloadingPdf: boolean;
  compiling: boolean;
  disabled: boolean;
}

type TabType = 'modul' | 'lkpd' | 'bahan_ajar';

export default function HasilAkhirSection({
  compiledModule,
  editedHtml,
  setEditedHtml,
  editedLkpdHtml,
  setEditedLkpdHtml,
  editedBahanAjarHtml,
  setEditedBahanAjarHtml,
  onCompile,
  onCopy,
  onDownloadHtml,
  onDownloadWord,
  onDownloadPdf,
  downloadingPdf,
  compiling,
  disabled
}: HasilAkhirSectionProps) {

  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('modul');

  if (disabled) {
    return (
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400">Section 4: Hasil Akhir & Penerbitan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Menunggu pengisian Paket Pembelajaran selesai...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentHtml = activeTab === 'modul' 
    ? editedHtml 
    : activeTab === 'lkpd' 
      ? editedLkpdHtml 
      : editedBahanAjarHtml;

  const setCurrentHtml = (html: string) => {
    if (activeTab === 'modul') {
      setEditedHtml(html);
    } else if (activeTab === 'lkpd') {
      setEditedLkpdHtml(html);
    } else if (activeTab === 'bahan_ajar') {
      setEditedBahanAjarHtml(html);
    }
  };

  // Formatting helper command
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setCurrentHtml(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setCurrentHtml(editorRef.current.innerHTML);
    }
  };

  const handleCopy = () => {
    onCopy(activeTab);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTabLabel = activeTab === 'modul' 
    ? 'Modul Ajar' 
    : activeTab === 'lkpd' 
      ? 'LKPD' 
      : 'Bahan Ajar';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Section 4: Penerbitan & Hasil Akhir Perangkat Pembelajaran
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Kompilasi seluruh rancangan Anda menjadi dokumen utuh, komprehensif, dan siap cetak/unduh. Lengkap dengan LKPD dan Bahan Ajar Mandiri.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {!compiledModule ? (
          <div className="text-center py-10 space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Dokumen Siap Diterbitkan!</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rancangan materi, tujuan pembelajaran, kriteria, asesmen, skenario pembelajaran, dan profil lulusan Anda telah disinkronisasikan. Silakan klik tombol di bawah untuk menyusun Modul Ajar, LKPD, dan Bahan Ajar secara otomatis.
              </p>
            </div>
            <button
              onClick={onCompile}
              disabled={compiling}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:bg-indigo-400 transition-all"
            >
              {compiling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengkompilasi Seluruh Dokumen...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Kompilasi Dokumen Pembelajaran Lengkap (Modul, LKPD, & Bahan Ajar)
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 gap-1 bg-slate-50/50 px-2 pt-2 rounded-t-xl">
              <button
                onClick={() => setActiveTab('modul')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x inline-flex items-center gap-1.5 ${
                  activeTab === 'modul'
                    ? 'bg-white border-slate-200 text-indigo-700 shadow-2xs'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                📖 Modul Ajar (Utama)
              </button>
              <button
                onClick={() => setActiveTab('lkpd')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x inline-flex items-center gap-1.5 ${
                  activeTab === 'lkpd'
                    ? 'bg-white border-slate-200 text-indigo-700 shadow-2xs'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                📝 Lembar Kerja (LKPD)
              </button>
              <button
                onClick={() => setActiveTab('bahan_ajar')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x inline-flex items-center gap-1.5 ${
                  activeTab === 'bahan_ajar'
                    ? 'bg-white border-slate-200 text-indigo-700 shadow-2xs'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                📚 Bahan Ajar Mandiri
              </button>
            </div>

            {/* Toolbar Export */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 border border-slate-200 shadow-2xs cursor-pointer transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  {copied ? 'Tersalin!' : `Salin ${activeTabLabel}`}
                </button>
                <button
                  onClick={() => onDownloadHtml(activeTab)}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 border border-slate-200 shadow-2xs cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  Simpan HTML
                </button>
                <button
                  onClick={() => onDownloadWord(activeTab)}
                  className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 border border-indigo-100 shadow-2xs cursor-pointer transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Unduh Word ({activeTabLabel})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownloadPdf(activeTab)}
                  disabled={downloadingPdf}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  {downloadingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunduh PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Unduh PDF ({activeTabLabel})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* WYSIWYG Word-like Formatting Panel */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-slate-100/80 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1">
                <button onClick={() => execCommand('bold')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Tebal"><Bold className="w-3.5 h-3.5" /></button>
                <button onClick={() => execCommand('italic')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Miring"><Italic className="w-3.5 h-3.5" /></button>
                <button onClick={() => execCommand('underline')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Garis Bawah"><Underline className="w-3.5 h-3.5" /></button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Bullet"><List className="w-3.5 h-3.5" /></button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Angka"><ListOrdered className="w-3.5 h-3.5" /></button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <button onClick={() => execCommand('justifyLeft')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Rata Kiri"><AlignLeft className="w-3.5 h-3.5" /></button>
                <button onClick={() => execCommand('justifyCenter')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Rata Tengah"><AlignCenter className="w-3.5 h-3.5" /></button>
                <button onClick={() => execCommand('justifyRight')} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-all cursor-pointer" title="Rata Kanan"><AlignRight className="w-3.5 h-3.5" /></button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <button onClick={onCompile} className="ml-auto text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 p-1 cursor-pointer transition-all">
                  <RefreshCw className="w-3 h-3" /> Kompilasi Ulang
                </button>
              </div>

              {/* Document Editor Canvas (A4 Portrait Mockup) */}
              <div className="p-6 md:p-10 bg-slate-100 flex justify-center border-t border-slate-200 overflow-x-auto">
                <div
                  key={activeTab}
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  className="w-[210mm] min-h-[297mm] bg-white p-[20mm] md:p-[25mm] pl-[30mm] pr-[25mm] border border-slate-300 shadow-md prose prose-slate max-w-full text-left leading-relaxed focus:outline-hidden"
                  style={{ 
                    fontFamily: 'Cambria, Aptos, Calibri, Georgia, serif',
                    lineHeight: '1.25'
                  }}
                  dangerouslySetInnerHTML={{ __html: currentHtml }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center leading-relaxed">
              💡 <strong>Tips Guru:</strong> Dokumen di atas sepenuhnya interaktif! Anda dapat mengklik teks mana saja di dalam kanvas putih untuk mengedit, menambah, atau menghapus paragraf secara langsung sebelum melakukan pengunduhan.
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
