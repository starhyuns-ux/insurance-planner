import BoardPage from '@/components/BoardPage'

export const metadata = {
  title: '자유 게시판 | 인슈닷',
  description: '자유롭게 이야기를 나눠보세요.'
}

export default function FreeBoardPage() {
  return (
    <BoardPage
      boardType="free"
      boardTitle="자유 게시판"
      boardDesc="보험, 재테크, 일상 이야기 등 자유롭게 이야기를 나눠보세요."
      accentColor="bg-teal-600"
      accentBubble="bg-teal-500"
    />
  )
}
