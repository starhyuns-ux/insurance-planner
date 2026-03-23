import BoardPage from '@/components/BoardPage'

export const metadata = {
  title: 'Q&A 게시판 | 보험다이어트',
  description: '보험에 관한 궁금한 점을 자유롭게 질문하고 답변을 받아보세요.'
}

export default function QnABoardPage() {
  return (
    <BoardPage
      boardType="qna"
      boardTitle="Q&A 게시판"
      boardDesc="보험에 관한 궁금한 점을 자유롭게 질문하고 답변을 받아보세요."
      accentColor="bg-green-600"
      accentBubble="bg-green-500"
    />
  )
}
