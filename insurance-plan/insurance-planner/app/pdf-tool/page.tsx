'use client';

import { useRef, useState, useEffect } from 'react';

export default function PdfCoordinateTool() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Dynamic Templates & Custom Upload
  const [templates, setTemplates] = useState<{ name: string; file: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image');
  
  // PDF Multi-page States
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [clicks, setClicks] = useState<Array<{ name: string; x: number; y: number; width?: number; height?: number }>>([]);
  const [currentFieldName, setCurrentFieldName] = useState('');
  
  // UI States
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);

  // 1. Load PDF.js from CDN
  useEffect(() => {
    if ((window as any).pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfjsLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // 2. Load templates from API
  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          const mapped = data.files.map((f: string) => ({
            name: f.replace('.png', ''),
            file: f
          }));
          setTemplates(mapped);
          if (!customFileUrl) {
            setSelectedFile(mapped[0].file);
            setFileType('image');
          }
        }
      })
      .catch(() => {});
  }, []);

  // 3. Load PDF Document (for multi-page support)
  useEffect(() => {
    if (fileType !== 'pdf' || !pdfjsLoaded || selectedFile !== 'custom' || !customFileUrl) {
      setPdfDoc(null);
      return;
    }

    const loadPdf = async () => {
      try {
        const loadingTask = (window as any).pdfjsLib.getDocument({
          url: customFileUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        alert('PDF 로딩 중 오류가 발생했습니다. (삼성화재 등 특수 폰트는 지원되지 않습니다.)');
      }
    };

    loadPdf();
  }, [fileType, customFileUrl, pdfjsLoaded, selectedFile]);

  // 4. Render specific PDF Page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const originalViewport = page.getViewport({ scale: 1.0 });
        setPdfDimensions({ width: originalViewport.width, height: originalViewport.height });

        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'print'
        }).promise;
      } catch (error) {
        // silently fail
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
      setSelectedFile('custom');
      setFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
      setClicks([]);
      setPdfDimensions({ width: 0, height: 0 });
    }
  };

  const getCanvasMousePos = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pos = getCanvasMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    setCurrentPos(getCanvasMousePos(e));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !containerRef.current || pdfDimensions.height === 0) return;
    setIsDrawing(false);

    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = pdfDimensions.width / rect.width;
    const scaleY = pdfDimensions.height / rect.height;

    const finalPos = getCanvasMousePos(e);
    
    const canvasMinX = Math.min(startPos.x, finalPos.x);
    const canvasMaxX = Math.max(startPos.x, finalPos.x);
    const canvasMinY = Math.min(startPos.y, finalPos.y);
    const canvasMaxY = Math.max(startPos.y, finalPos.y);

    const pdfMinX = canvasMinX * scaleX;
    const pdfMaxX = canvasMaxX * scaleX;
    const pdfMinY = canvasMinY * scaleY;
    const pdfMaxY = canvasMaxY * scaleY;

    // PDF-lib coordinate system (0,0 is bottom-left)
    const pdfX = pdfMinX;
    const pdfY = pdfDimensions.height - pdfMaxY; 
    const pdfWidth = pdfMaxX - pdfMinX;
    const pdfHeight = pdfMaxY - pdfMinY;

    const isBox = (canvasMaxX - canvasMinX > 5) || (canvasMaxY - canvasMinY > 5);

    const newClick = {
      // 페이지가 여러개일 경우 필드 이름에 _page번호 를 추가하여 구분 용이하게
      name: currentFieldName || `field_p${currentPage}_${clicks.length + 1}`,
      x: Math.round(pdfX),
      y: Math.round(pdfY),
      ...(isBox ? { width: Math.round(pdfWidth), height: Math.round(pdfHeight) } : {})
    };

    setClicks([...clicks, newClick]);
    setCurrentFieldName('');
  };

  const removeClick = (index: number) => {
    setClicks(clicks.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    const text = clicks.map((c) => {
      if (c.width && c.height) {
        return `${c.name}: { x: ${c.x}, y: ${c.y}, size: 10, maxWidth: ${c.width}, height: ${c.height} },`;
      }
      return `${c.name}: { x: ${c.x}, y: ${c.y}, size: 10 },`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  const imageSource = selectedFile === 'custom' && fileType === 'image' && customFileUrl 
    ? customFileUrl 
    : `/templates/${selectedFile}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar - Controls */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-6 flex flex-col z-20 h-full overflow-y-auto">
          <h1 className="text-2xl font-bold mb-2">PDF 좌표 추출기</h1>
          <p className="text-gray-400 text-sm mb-6">마우스를 클릭하거나 드래그하여 좌표(박스)를 추출하세요.</p>

          <div className="mb-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium mb-3 text-gray-200">1. 작업할 문서 선택</label>
            
            <select
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-3"
              value={selectedFile}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedFile(val);
                setFileType(val === 'custom' ? (customFileUrl?.startsWith('blob') ? fileType : 'image') : 'image');
                setClicks([]);
              }}
            >
              {templates.length === 0 && <option value="">서버 폴더 로딩 중...</option>}
              {templates.map((t) => (
                <option key={t.file} value={t.file}>
                  {t.name} (서버 파일)
                </option>
              ))}
              <option value="custom">-- 직접 파일 업로드 (PDF/이미지) --</option>
            </select>

            <div className={`transition-all ${selectedFile === 'custom' ? 'block' : 'hidden'}`}>
              <input 
                type="file" 
                accept="image/png, image/jpeg, application/pdf" 
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            
            <p className="text-xs text-orange-400 mt-3 leading-relaxed">
              * 삼성화재 등 특수 보안 폰트가 들어간 PDF는 <b>브라우저에서 글씨가 깨집니다!</b><br/>
              * 글씨가 깨질 경우, 터미널에서 <code>bash scripts/convert-to-png.sh</code> 를 실행하시면 삼성화재의 <b>모든 페이지</b>가 이미지로 변환되어 목록에 뜹니다!
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              2. 화면 줌 조절 ({zoom}%)
            </label>
            <input 
              type="range" 
              min="30" max="300" 
              value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))} 
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">3. 다음 추출할 필드 이름 (옵션)</label>
            <input
              type="text"
              placeholder="예: customer_name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={currentFieldName}
              onChange={(e) => setCurrentFieldName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto mt-4 border-t border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-3">추출된 좌표 목록</h2>
            {clicks.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">아직 추출한 좌표가 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {clicks.map((click, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <div>
                      <span className="font-mono text-sm text-blue-400">{click.name}:</span>
                      <br />
                      <span className="font-mono text-xs text-gray-300">
                        x: {click.x}, y: {click.y}
                        {click.width ? `, w: ${click.width}, h: ${click.height}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => removeClick(i)}
                      className="text-red-400 hover:text-red-300 p-1 font-bold"
                      title="삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {clicks.length > 0 && (
            <button
              onClick={copyToClipboard}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              코드 복사하기
            </button>
          )}
        </div>

        {/* Right Content - Viewer */}
        <div className="w-full md:w-2/3 p-6 bg-gray-100 overflow-auto flex flex-col items-center relative h-full">
          
          {/* Multi-page Controls */}
          {fileType === 'pdf' && totalPages > 1 && (
            <div className="mb-4 flex items-center space-x-4 bg-white p-3 rounded-lg shadow">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 font-bold"
              >
                ◀ 이전 페이지
              </button>
              <span className="font-medium text-gray-700">
                {currentPage} / {totalPages} 페이지
              </span>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 font-bold"
              >
                다음 페이지 ▶
              </button>
            </div>
          )}

          <div 
            ref={containerRef}
            className="relative shadow-2xl rounded-sm bg-white cursor-crosshair select-none flex-shrink-0"
            style={{ width: `${zoom}%`, minHeight: '500px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Type 1: Image Viewer */}
            {fileType === 'image' && selectedFile && (
              <img
                ref={imgRef}
                src={imageSource}
                alt="Document Template"
                className="w-full h-auto select-none pointer-events-none"
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  setPdfDimensions({
                    width: target.naturalWidth / 2,
                    height: target.naturalHeight / 2
                  });
                }}
                onError={() => {}}
              />
            )}

            {/* Type 2: PDF Viewer */}
            {fileType === 'pdf' && selectedFile === 'custom' && (
              <>
                {!pdfDoc && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <span className="text-gray-500 font-medium">PDF 엔진 로딩중...</span>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: pdfDoc ? 1 : 0.5 }}
                />
              </>
            )}

            {!selectedFile && (
              <div className="flex items-center justify-center h-full w-full bg-gray-200">
                <span className="text-gray-500">문서를 선택해 주세요.</span>
              </div>
            )}
            
            {/* Drawing preview */}
            {isDrawing && (
              <div 
                className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-20"
                style={{
                  left: Math.min(startPos.x, currentPos.x),
                  top: Math.min(startPos.y, currentPos.y),
                  width: Math.abs(currentPos.x - startPos.x),
                  height: Math.abs(currentPos.y - startPos.y)
                }}
              />
            )}

            {/* Clicks & Boxes */}
            {clicks.map((click, i) => {
              if (!containerRef.current || pdfDimensions.height === 0) return null;
              
              const pdfTopY = pdfDimensions.height - click.y - (click.height || 0);
              const percentLeft = (click.x / pdfDimensions.width) * 100;
              const percentTop = (pdfTopY / pdfDimensions.height) * 100;
              const percentWidth = ((click.width || 0) / pdfDimensions.width) * 100;
              const percentHeight = ((click.height || 0) / pdfDimensions.height) * 100;

              if (click.width && click.height) {
                return (
                  <div
                    key={i}
                    className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none group"
                    style={{
                      left: `${percentLeft}%`,
                      top: `${percentTop}%`,
                      width: `${percentWidth}%`,
                      height: `${percentHeight}%`,
                    }}
                  >
                    <span className="absolute -top-6 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-75 group-hover:opacity-100">
                      {click.name}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none group"
                  style={{
                    left: `${percentLeft}%`,
                    top: `${percentTop}%`,
                  }}
                >
                  <span className="absolute left-5 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-75 group-hover:opacity-100">
                    {click.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
