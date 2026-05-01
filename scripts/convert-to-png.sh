#!/bin/bash

cd public/templates || exit

echo "PDF 파일들을 PNG 이미지로 변환합니다... (Ghostscript 필요)"

for f in *.pdf; do
  # grid_ 로 시작하는 파일은 제외
  if [[ "$f" == grid_* ]]; then
    continue
  fi
  
  # a.PDF 같은 확장자 처리
  filename=$(basename -- "$f")
  filename_noext="${filename%.*}"
  
  echo "변환 중: $f -> ${filename_noext}.png"
  
  # 144 DPI로 렌더링 (기본 72 DPI의 2배 크기) -> 나중에 절반으로 나누면 원본 좌표와 일치
  gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r144 -dFirstPage=1 -dLastPage=1 -sOutputFile="${filename_noext}.png" "$f"
done

echo "✅ 모든 변환이 완료되었습니다!"
