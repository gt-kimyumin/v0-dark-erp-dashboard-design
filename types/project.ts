export type ProjectStatus = "대기" | "진행중 - 설계" | "진행중 - 제작" | "진행중 - 최종 검토" | "완료"
export type ProjectType = "보안" | "일반"
export type ProjectStage = "설계" | "제작" | "최종 검토" | "완료"

export interface Project {
  id: number
  client: string
  title: string
  type: ProjectType
  worker: string
  registrar: string
  startDate: Date
  endDate: Date
  status: ProjectStatus
  stage?: ProjectStage
}

export interface QualityDocument {
  id: number
  category: string
  name: string
  registrationDate: Date
  endDate: Date
  status: "진행중" | "완료"
  remarks?: string
}

export interface PaymentItem {
  id: number
  name: string
  category: string
  purchaseDate: Date
  receipt?: File
  memo: string
  photo?: File
  status: "대기" | "승인" | "반려"
}

export interface ProductionMaterial {
  id: number
  type: "가공품" | "구매품"
  name: string
  registrationDate: Date
  endDate: Date
  status: "대기" | "진행중" | "입고 완료"
  remarks: string
}
