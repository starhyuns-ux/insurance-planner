#!/bin/bash

cd public/templates || exit

echo "PDF 파일들을 PNG 이미지로 변환합니다... (전체 페이지 변환)"

for f in *.pdf; do
  # grid_ 로 시작하는 파일은 제외
  if [[ "$f" == grid_* ]]; then
    continue
  fi
  
  filename=$(basename -- "$f")
  filename_noext="${filename%.*}"
  
  echo "변환 중: $f -> ${filename_noext}_page(숫자).png"
  
  # 전체 페이지를 각각의 PNG로 변환합니다. (_page1, _page2...)
  gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r144 -sOutputFile="${filename_noext}_page%d.png" "$f"
done

echo "✅ 모든 페이지 변환이 완료되었습니다!"
