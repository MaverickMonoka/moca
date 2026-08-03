export type Sector =
  | 'Agriculture'
  | 'Technology'
  | 'Construction'
  | 'Manufacturing'
  | 'Tourism'
  | 'Creative Industries'
  | 'Youth'
  | 'Women Owned Businesses'

export type BusinessStage = 'Idea' | 'Startup' | 'Early Growth' | 'Established' | 'Scaling'

export interface FundingOpportunity {
  id: string
  organisation: string
  title: string
  description: string
  sector: Sector
  amount_min: number
  amount_max: number
  eligibility: string
  closing_date: string
  application_url: string | null
  logo_url: string | null
  featured: boolean
  created_at: string
}

export type ArticleCategory =
  | 'Funding News'
  | 'Business Growth'
  | 'AI & Technology'
  | 'Agriculture'
  | 'Construction'
  | 'SMME Advice'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: ArticleCategory
  cover_image: string | null
  author: string
  published_at: string
  read_minutes: number
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  lessons_count: number
  duration_minutes: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  cover_image: string | null
  price: number
}

export interface BusinessProfile {
  id: string
  user_id: string
  business_name: string
  business_type: string
  sector: Sector
  location: string
  stage: BusinessStage
  funding_requirement: number
  moca_score: number
  registration_number: string | null
}

export interface Application {
  id: string
  user_id: string
  funding_opportunity_id: string
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'declined' | 'funded'
  submitted_at: string | null
  funding_opportunity?: FundingOpportunity
}

export interface Investor {
  id: string
  name: string
  organisation: string
  focus_sectors: Sector[]
  ticket_min: number
  ticket_max: number
  bio: string
  logo_url: string | null
}

export type ProductCategory =
  | 'Agriculture & Produce'
  | 'Construction & Hardware'
  | 'Fashion & Apparel'
  | 'Food & Beverage'
  | 'Beauty & Wellness'
  | 'Tech & Electronics'
  | 'Arts & Crafts'
  | 'Services'

export interface Product {
  id: string
  user_id: string
  seller_name: string
  seller_phone: string
  business_name: string | null
  title: string
  description: string
  category: ProductCategory
  price: number
  unit: string
  stock_quantity: number | null
  location: string
  image_url: string | null
  status: 'active' | 'sold_out' | 'archived'
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  author_name: string
  author_avatar: string | null
  title: string
  body: string
  tag: string
  replies_count: number
  created_at: string
}

export interface AIMatchInput {
  businessType: string
  industry: Sector
  location: string
  fundingRequirement: number
  businessStage: BusinessStage
}

export interface AIMatchResult {
  matches: {
    organisation: string
    title: string
    fitReason: string
    amountRange: string
  }[]
  requiredDocuments: string[]
  recommendations: string[]
}
