'use client';

import { useRef, useState } from 'react';

const TEMPLATES = [
  { name: '삼성화재', file: 'samsungfire.png' },
  { name: '현대해상', file: 'hyundaifire.png' },
  { name: 'KB손해보험', file: 'kbfire.png' },
  { name: 'DB손해보험', file: 'dbfire.png' },
  { name: '메리츠화재', file: 'meritzfirefire.png' },
  { name: '한화손해보험', file: 'hanhwafire.png' },
  { name: 'AIG손보', file: 'aigfire.png' },
  { name: '에이스손보(Chubb)', file: 'chubbfire.png' },
];

export default function PdfCoordinateTool() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [selectedPdf, setSelectedPdf] = useState(TEMPLATES[0].file);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [clicks, setClicks] = useState<Array<{ name: string; x: number; y: number; width?: number; height?: number }>>([]);
  const [currentFieldName, setCurrentFieldName] = useState('');
  
  // UI States
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

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
      name: currentFieldName || `field_${clicks.length + 1}`,
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar - Controls */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-6 flex flex-col z-20 h-full overflow-y-auto">
          <h1 className="text-2xl font-bold mb-2">PDF 좌표 추출기</h1>
          <p className="text-gray-400 text-sm mb-6">마우스를 클릭하거나 드래그하여 좌표(박스)를 추출하세요.</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">보험사 양식 선택</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={selectedPdf}
              onChange={(e) => {
                setSelectedPdf(e.target.value);
                setClicks([]);
              }}
            >
              {TEMPLATES.map((t) => (
                <option key={t.file} value={t.file}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-orange-400 mt-2">
              ※ 만약 이미지가 깨지거나 안 보인다면, 터미널에서 <code>bash scripts/convert-to-png.sh</code> 스크립트를 먼저 실행해 주세요.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              화면 줌 조절 ({zoom}%)
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
            <label className="block text-sm font-medium mb-2 text-gray-300">다음 추출할 필드 이름 (옵션)</label>
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

        {/* Right Content - PDF Image */}
        <div className="w-full md:w-2/3 p-6 bg-gray-100 overflow-auto flex justify-center items-start relative h-full">
          <div 
            ref={containerRef}
            className="relative shadow-2xl rounded-sm bg-white cursor-crosshair select-none flex-shrink-0"
            style={{ width: `${zoom}%`, minHeight: '500px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Ghostscript 144 DPI로 변환된 PNG (원본의 2배 크기) -> 50% 로 렌더링하면 원본 좌표계(72 DPI)와 정확히 일치함 */}
            <img
              ref={imgRef}
              src={`/templates/${selectedPdf}`}
              alt={selectedPdf}
              className="w-full h-auto select-none pointer-events-none"
              onLoad={(e) => {
                // 원본 PDF 좌표계 단위(points)는 72 DPI 기준입니다.
                // 이미지는 144 DPI로 추출되었으므로, 이미지의 픽셀 크기 / 2 가 곧 원본 PDF의 포인트 크기와 같습니다.
                const target = e.target as HTMLImageElement;
                setPdfDimensions({
                  width: target.naturalWidth / 2,
                  height: target.naturalHeight / 2
                });
              }}
              onError={(e) => {
                console.error("이미지를 찾을 수 없습니다:", selectedPdf);
              }}
            />
            
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
