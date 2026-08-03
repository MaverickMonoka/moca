-- Optional demo content — safe to run after schema.sql to populate the
-- Funding Marketplace, Insights and Academy with realistic starter data.

insert into public.funding_opportunities
  (organisation, title, description, sector, amount_min, amount_max, eligibility, closing_date, application_url, featured, status)
values
  ('National Empowerment Fund', 'uMSOBOMVU Youth Enterprise Fund', 'Blended finance for young entrepreneurs aged 18–35 starting or scaling a business.', 'Youth', 50000, 2000000, 'South African citizens aged 18–35, majority youth-owned business', '2026-10-31', 'https://www.nefcorp.co.za', true, 'open'),
  ('Land Bank', 'Agri-Enterprise Development Fund', 'Funding for emerging farmers to expand production, equipment and irrigation infrastructure.', 'Agriculture', 100000, 5000000, 'Registered farming enterprise with proof of land access', '2026-09-15', 'https://landbank.co.za', true, 'open'),
  ('IDC', 'Women Entrepreneurship Fund', 'Growth capital for majority women-owned businesses in manufacturing and services.', 'Women Owned Businesses', 250000, 10000000, '51%+ women ownership, existing trading business', '2026-11-30', 'https://www.idc.co.za', true, 'open'),
  ('CIDB & NHBRC', 'Contractor Development Programme', 'Grading support and mentorship capital for emerging civil and building contractors.', 'Construction', 80000, 3000000, 'CIDB registered contractor, Grade 1–5', '2026-09-30', null, false, 'open'),
  ('Google for Startups', 'Africa Growth Accelerator', 'Equity-free support, mentorship and cloud credits for scaling technology startups.', 'Technology', 0, 0, 'Seed to Series A African tech startups', '2026-08-31', 'https://startup.google.com', false, 'open'),
  ('National Youth Development Agency', 'Creative Industries Grant', 'Non-repayable grants for youth-owned businesses in fashion, music, film and design.', 'Creative Industries', 20000, 500000, 'Youth-owned creative business, 18–35', '2026-10-01', 'https://nyda.gov.za', false, 'open')
on conflict do nothing;

insert into public.articles (title, slug, excerpt, content, category, author, status, published_at, read_minutes)
values
  ('Five funds opening applications this quarter', 'five-funds-opening-applications-this-quarter', 'A roundup of the government and private funds accepting SMME applications before September.', 'Full article body goes here.', 'Funding News', 'MOCA Research Desk', 'published', '2026-07-20', 4),
  ('How to build a funding-ready financial statement', 'how-to-build-a-funding-ready-financial-statement', 'What investors and DFIs actually look for in your numbers, and how to present them.', 'Full article body goes here.', 'SMME Advice', 'MOCA Research Desk', 'published', '2026-07-14', 6),
  ('AI tools every South African founder should try', 'ai-tools-every-south-african-founder-should-try', 'From bookkeeping to customer support, practical AI tools that save real hours.', 'Full article body goes here.', 'AI & Technology', 'MOCA Research Desk', 'published', '2026-07-08', 5)
on conflict (slug) do nothing;

insert into public.courses (title, description, category, lessons_count, duration_minutes, level, price)
values
  ('Starting a Business', 'From idea validation to your first customer, the fundamentals of launching in South Africa.', 'Foundations', 8, 95, 'Beginner', 0),
  ('Business Registration', 'CIPC registration, tax numbers, UIF and the paperwork that unlocks funding eligibility.', 'Compliance', 6, 70, 'Beginner', 0),
  ('Funding Readiness', 'Build the financials, pitch deck and documentation funders expect to see.', 'Funding', 10, 140, 'Intermediate', 0),
  ('Tender Academy', 'How government and corporate tenders work, and how to bid competitively.', 'Procurement', 9, 120, 'Intermediate', 0),
  ('Digital Marketing', 'WhatsApp commerce, social media and low-budget growth tactics that work in South Africa.', 'Growth', 7, 85, 'Beginner', 0),
  ('Financial Management', 'Cash flow, pricing and the reporting discipline that keeps a business bankable.', 'Finance', 8, 110, 'Advanced', 0),
  ('Pricing Your Product or Service', 'How to price for profit without pricing yourself out of the market — cost-plus, value-based and competitor approaches.', 'Finance', 6, 75, 'Beginner', 0),
  ('Basic Bookkeeping', 'Track income and expenses, reconcile a bank account, and produce the records funders and SARS expect.', 'Finance', 8, 100, 'Beginner', 0),
  ('Negotiation & Supplier Deals', 'Practical tactics for negotiating better terms with suppliers, landlords and corporate clients.', 'Growth', 5, 65, 'Intermediate', 0)
on conflict do nothing;
