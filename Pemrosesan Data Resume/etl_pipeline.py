import os
import re
import logging
import pandas as pd
from pypdf import PdfReader

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("etl_pipeline.log", mode='w', encoding='utf-8')
    ]
)

# Standard English Stopwords to make the script self-contained and highly reliable
STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
    'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
    'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
    "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
    'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
    'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
    'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
}

SKILLS_DICTIONARY = {
    # IT & Software Engineering (INFORMATION-TECHNOLOGY)
    'python': ['python'],
    'java': ['java'],
    'c++': ['c\\+\\+'],
    'c#': ['c#'],
    'javascript': ['javascript', 'js'],
    'typescript': ['typescript', 'ts'],
    'php': ['php'],
    'ruby': ['ruby'],
    'html': ['html'],
    'css': ['css'],
    'react': ['react'],
    'angular': ['angular'],
    'vue': ['vue'],
    'node.js': ['node\\.js', 'nodejs'],
    'sql': ['sql', 'mysql', 'postgresql'],
    'nosql': ['nosql', 'mongodb', 'cassandra'],
    'aws': ['aws', 'amazon web services'],
    'azure': ['azure'],
    'gcp': ['gcp', 'google cloud'],
    'docker': ['docker'],
    'kubernetes': ['kubernetes', 'k8s'],
    'git': ['git', 'github', 'gitlab'],
    'linux': ['linux'],
    'devops': ['devops'],
    'machine learning': ['machine learning', 'ml'],
    'deep learning': ['deep learning', 'dl'],
    'artificial intelligence': ['artificial intelligence', 'ai'],
    'cyber security': ['cyber security', 'infosec', 'firewall'],
    'networks': ['networks', 'networking', 'cisco'],
    'agile': ['agile', 'scrum'],

    # Accounting & Finance (ACCOUNTANT / BANKING / FINANCE)
    'accounting': ['accounting', 'bookkeeping'],
    'auditing': ['auditing', 'audit'],
    'taxation': ['taxation', 'tax', 'taxes'],
    'excel': ['excel', 'spreadsheet'],
    'quickbooks': ['quickbooks', 'qb'],
    'sap': ['sap'],
    'ledger': ['ledger', 'general ledger'],
    'reconciliation': ['reconciliation', 'reconcile'],
    'billing': ['billing', 'invoice', 'invoicing'],
    'payroll': ['payroll'],
    'budgeting': ['budgeting', 'budget', 'budgets'],
    'forecasting': ['forecasting', 'forecast'],
    'banking': ['banking', 'bank'],
    'portfolio management': ['portfolio management'],
    'risk management': ['risk management', 'risk mitigation'],
    'financial analysis': ['financial analysis', 'finance'],
    'compliance': ['compliance'],
    'cpa': ['cpa', 'certified public accountant'],
    'gaap': ['gaap'],
    'aml': ['aml', 'anti-money laundering'],
    'kyc': ['kyc', 'know your customer'],

    # HR & Management (HR / CONSULTANT)
    'recruitment': ['recruitment', 'recruiting', 'hiring'],
    'onboarding': ['onboarding'],
    'employee relations': ['employee relations'],
    'performance management': ['performance management'],
    'training': ['training', 'development'],
    'leadership': ['leadership', 'team management'],
    'talent acquisition': ['talent acquisition'],
    'hr policies': ['hr policies', 'human resources'],
    'conflict resolution': ['conflict resolution'],
    'interviewing': ['interviewing', 'interview'],
    'business analysis': ['business analysis'],
    'strategy': ['strategy', 'strategic planning'],
    'change management': ['change management'],
    'process optimization': ['process optimization'],
    'stakeholder management': ['stakeholder management'],

    # Marketing, Sales & PR (SALES / PUBLIC-RELATIONS / DIGITAL-MEDIA / BUSINESS-DEVELOPMENT)
    'sales': ['sales', 'selling'],
    'marketing': ['marketing'],
    'seo': ['seo', 'search engine optimization'],
    'sem': ['sem', 'ppc', 'adwords'],
    'social media': ['social media', 'facebook', 'instagram', 'twitter'],
    'content creation': ['content creation', 'copywriting'],
    'crm': ['crm', 'salesforce', 'hubspot'],
    'negotiation': ['negotiation', 'negotiating'],
    'market research': ['market research'],
    'advertising': ['advertising', 'ads'],
    'brand management': ['brand management', 'branding', 'brand building'],
    'media relations': ['media relations', 'press releases'],
    'crisis communication': ['crisis communication'],
    'event planning': ['event planning', 'event management'],
    'public speaking': ['public speaking', 'presentation'],
    'lead generation': ['lead generation'],
    'b2b sales': ['b2b sales', 'business-to-business'],
    'client acquisition': ['client acquisition', 'client relations'],
    'partnership development': ['partnership development'],

    # Creative & Design (DESIGNER / ARTS / APPAREL)
    'figma': ['figma'],
    'photoshop': ['photoshop', 'ps'],
    'illustrator': ['illustrator'],
    'indesign': ['indesign'],
    'ui/ux': ['ui/ux', 'ui design', 'ux design', 'user interface', 'user experience'],
    'graphic design': ['graphic design'],
    'video editing': ['video editing', 'premiere pro', 'after effects'],
    'creative direction': ['creative direction'],
    'sketching': ['sketching', 'drawing'],
    '3d modeling': ['3d modeling', 'cad'],
    'typography': ['typography'],
    'fashion design': ['fashion design'],
    'textiles': ['textiles', 'fabric'],
    'merchandising': ['merchandising'],
    'tailoring': ['tailoring', 'sewing'],
    'painting': ['painting'],
    'sculpting': ['sculpting'],
    'photography': ['photography', 'photo'],
    'curating': ['curating', 'exhibition'],

    # Healthcare & Fitness (HEALTHCARE / FITNESS)
    'patient care': ['patient care', 'patient safety'],
    'nursing': ['nursing', 'nurse'],
    'clinical': ['clinical'],
    'diagnosis': ['diagnosis', 'diagnostic'],
    'medical records': ['medical records', 'emr', 'ehr'],
    'cpr': ['cpr'],
    'first aid': ['first aid'],
    'pharmacology': ['pharmacology', 'pharmacy'],
    'surgery': ['surgery', 'surgical'],
    'personal training': ['personal training', 'fitness trainer'],
    'nutrition planning': ['nutrition', 'dietary'],
    'strength training': ['strength training', 'conditioning'],
    'yoga': ['yoga'],
    'kinesiology': ['kinesiology'],

    # Education & Teaching (TEACHER)
    'curriculum development': ['curriculum', 'curriculum design'],
    'classroom management': ['classroom management'],
    'lesson planning': ['lesson planning'],
    'tutoring': ['tutoring', 'tutor'],
    'grading': ['grading'],
    'special education': ['special education'],
    'mentoring': ['mentoring', 'mentor'],
    'pedagogy': ['pedagogy'],
    'educational technology': ['educational technology', 'edtech'],

    # Legal & Advocacy (ADVOCATE)
    'litigation': ['litigation', 'court'],
    'legal research': ['legal research'],
    'advocacy': ['advocacy'],
    'contract drafting': ['contract drafting', 'contracts'],
    'legal counsel': ['legal counsel', 'legal advisory'],
    'intellectual property': ['intellectual property', 'ip'],
    'mediation': ['mediation', 'arbitration'],

    # Agriculture (AGRICULTURE)
    'farming': ['farming', 'farm'],
    'agronomy': ['agronomy'],
    'crop management': ['crop management', 'crops'],
    'soil science': ['soil science', 'soil'],
    'irrigation': ['irrigation'],
    'livestock': ['livestock', 'cattle'],
    'pest control': ['pest control', 'pesticides'],

    # Automobile (AUTOMOBILE)
    'vehicle diagnostics': ['vehicle diagnostics', 'diagnostics'],
    'auto repair': ['auto repair', 'mechanic'],
    'automotive engineering': ['automotive engineering'],
    'engine tuning': ['engine tuning', 'engine'],
    'brake systems': ['brake systems', 'brakes'],

    # Aviation (AVIATION)
    'flight operations': ['flight operations'],
    'aircraft maintenance': ['aircraft maintenance', 'aviation maintenance'],
    'piloting': ['piloting', 'pilot'],
    'aerodynamics': ['aerodynamics'],
    'air traffic control': ['air traffic control'],
    'avionics': ['avionics'],

    # BPO & Customer Service (BPO)
    'customer support': ['customer support', 'customer service'],
    'telemarketing': ['telemarketing'],
    'data entry': ['data entry'],
    'call center': ['call center'],
    'technical support': ['technical support'],

    # Chef & Culinary (CHEF)
    'culinary arts': ['culinary', 'cooking'],
    'menu planning': ['menu planning', 'menu'],
    'food preparation': ['food preparation', 'food prep'],
    'kitchen management': ['kitchen management', 'kitchen'],
    'food safety': ['food safety', 'haccp'],
    'plating': ['plating'],

    # Construction & Engineering (CONSTRUCTION / ENGINEERING)
    'blueprint reading': ['blueprint reading', 'blueprints'],
    'site supervision': ['site supervision', 'construction site'],
    'safety management': ['safety management', 'osha'],
    'carpentry': ['carpentry'],
    'masonry': ['masonry'],
    'solidworks': ['solidworks'],
    'matlab': ['matlab'],
    'mechanical design': ['mechanical design'],
    'electrical circuits': ['electrical circuits', 'electronics'],
    'plc programming': ['plc programming', 'plc']
}

def process_single_pdf(task):
    category, filename, pdf_path = task
    try:
        reader = PdfReader(pdf_path)
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        combined_text = "\n".join(text_parts).strip()
        file_size = os.path.getsize(pdf_path)
        
        # ID generation
        base_name = os.path.splitext(filename)[0]
        clean_cat = re.sub(r'[^a-zA-Z0-9]', '', category)
        clean_base = re.sub(r'[^a-zA-Z0-9]', '', base_name)
        resume_id = f"RES_{clean_cat}_{clean_base}"
        
        return {
            'resume_id': resume_id,
            'category': category,
            'original_filename': filename,
            'file_size_bytes': file_size,
            'raw_text': combined_text,
            'success': True
        }
    except Exception as e:
        return {'success': False}

class ResumeETLPipeline:
    def __init__(self, dataset_path_pdf, dataset_path_csv=None):
        self.dataset_path_pdf = os.path.abspath(dataset_path_pdf) if dataset_path_pdf else None
        self.dataset_path_csv = os.path.abspath(dataset_path_csv) if dataset_path_csv else None
        self.raw_data_pdf = []
        self.raw_data_csv = None
        self.processed_df_pdf = None
        self.processed_df_csv = None
        self.assessment_report = {}

    def generate_resume_id(self, category, filename):
        """Generates a clean and unique structured ID for each resume."""
        base_name = os.path.splitext(filename)[0]
        # Clean both category and base_name to leave only alphanumeric characters
        clean_cat = re.sub(r'[^a-zA-Z0-9]', '', category)
        clean_base = re.sub(r'[^a-zA-Z0-9]', '', base_name)
        return f"RES_{clean_cat}_{clean_base}"

    def extract_text_from_pdf(self, pdf_path):
        """Extracts text from all pages of a PDF file using pypdf."""
        try:
            reader = PdfReader(pdf_path)
            text_parts = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            
            combined_text = "\n".join(text_parts).strip()
            return combined_text
        except Exception as e:
            logging.warning(f"Failed to read PDF {pdf_path}: {e}")
            return None

    def extract(self):
        """
        Gathers data from PDF resumes and CSV dataset.
        Extraction Stage of ETL.
        """
        logging.info(f"Starting Extraction phase...")
        
        self.raw_data_pdf = []
        if self.dataset_path_pdf and os.path.exists(self.dataset_path_pdf):
            logging.info(f"Extracting PDF data from: {self.dataset_path_pdf}")
            pdf_tasks = []
            for category in os.listdir(self.dataset_path_pdf):
                cat_path = os.path.join(self.dataset_path_pdf, category)
                if not os.path.isdir(cat_path):
                    continue

                for filename in os.listdir(cat_path):
                    if not filename.lower().endswith('.pdf'):
                        continue
                    pdf_path = os.path.join(cat_path, filename)
                    pdf_tasks.append((category, filename, pdf_path))

            total_files = len(pdf_tasks)
            logging.info(f"Discovered {total_files} PDF files to extract.")

            successful_extracts = 0
            failed_extracts = 0

            from concurrent.futures import ProcessPoolExecutor, as_completed
            
            logging.info("Extracting texts in parallel using ProcessPoolExecutor (Bypassing GIL)...")
            # Use dynamic process pool based on CPU cores
            max_workers = min(61, os.cpu_count() or 1)
            
            completed_count = 0
            with ProcessPoolExecutor(max_workers=max_workers) as executor:
                # Submit tasks
                futures = {executor.submit(process_single_pdf, task): task for task in pdf_tasks}
                
                # Retrieve results as they complete (real-time updates)
                for future in as_completed(futures):
                    completed_count += 1
                    if completed_count % 100 == 0 or completed_count == total_files:
                        logging.info(f"Progress: Extracted {completed_count}/{total_files} resumes ({completed_count/total_files*100:.1f}%)...")
                    
                    try:
                        res = future.result()
                        if res['success']:
                            res_data = res.copy()
                            del res_data['success']
                            self.raw_data_pdf.append(res_data)
                            successful_extracts += 1
                        else:
                            failed_extracts += 1
                    except Exception as e:
                        logging.error(f"Error extracting PDF: {e}")
                        failed_extracts += 1

            logging.info(f"Extraction completed. Total files found: {total_files}")
            logging.info(f"Successfully extracted: {successful_extracts}, Failed: {failed_extracts}")
            
            self.assessment_report['total_files_discovered'] = total_files
            self.assessment_report['successful_extractions'] = successful_extracts
            self.assessment_report['failed_extractions'] = failed_extracts
        
        # CSV Extraction
        if self.dataset_path_csv and os.path.exists(self.dataset_path_csv):
            logging.info(f"Extracting CSV data from {self.dataset_path_csv}")
            try:
                self.raw_data_csv = pd.read_csv(self.dataset_path_csv)
                self.assessment_report['csv_total_rows'] = len(self.raw_data_csv)
                logging.info(f"Successfully extracted {len(self.raw_data_csv)} rows from CSV.")
            except Exception as e:
                logging.error(f"Failed to read CSV: {e}")
        
        return self.raw_data_pdf

    def clean_text(self, text):
        """
        Performs data cleaning on text for traditional ML/NLP models:
        - Lowercasing
        - Removing URLs, emails, phone numbers
        - Removing special characters, symbols, punctuations, and digits
        - Merging extra whitespaces and standard stopword removal
        """
        if not text:
            return ""

        # 1. Convert to lowercase
        text = text.lower()

        # 2. Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', ' ', text)

        # 3. Remove emails
        text = re.sub(r'\S+@\S+', ' ', text)

        # 4. Remove contact/phone numbers (common formats)
        text = re.sub(r'\+?\d[\d\-\s\(\)\+]{7,}\d', ' ', text)

        # 5. Remove special characters, symbols, punctuation, and digits
        # Keep only letters and whitespaces
        text = re.sub(r'[^a-z\s]', ' ', text)

        # 6. Remove standard English stopwords
        words = text.split()
        cleaned_words = [w for w in words if w not in STOPWORDS]

        # 7. Merge multiple whitespaces and strip
        return " ".join(cleaned_words).strip()

    def extract_skills_from_text(self, text):
        """
        Extracts key skills matching our dictionary from cleaned text using regex word boundaries.
        """
        if not text:
            return ""
        
        matched_skills = []
        for skill_name, variations in SKILLS_DICTIONARY.items():
            for var in variations:
                # Use regex with word boundaries to match exact keywords
                if re.search(r'\b' + var + r'\b', text):
                    matched_skills.append(skill_name)
                    break # Stop checking other variations for this skill once matched
        
        return ", ".join(matched_skills)

    def assess(self):
        """
        Assesses the quality of the gathered data.
        Assessing Stage of Data Pipeline.
        """
        logging.info("Starting Data Assessing phase...")
        
        if not self.raw_data_pdf and self.raw_data_csv is None:
            logging.warning("No raw data available for assessment. Run extract() first.")
            return

        if self.raw_data_pdf:
            df = pd.DataFrame(self.raw_data_pdf)
            
            # 1. Check for empty text (missing values in text)
            empty_text_mask = df['raw_text'].str.strip() == ""
            empty_text_count = empty_text_mask.sum()
            
            # 2. Check for duplicate raw text (duplicate resumes)
            duplicate_text_mask = df.duplicated(subset=['raw_text'], keep=False)
            duplicate_count = df.duplicated(subset=['raw_text'], keep='first').sum()
            
            # 3. Word and character count stats on raw text
            df['word_count_raw'] = df['raw_text'].apply(lambda x: len(x.split()) if x else 0)
            df['char_count_raw'] = df['raw_text'].apply(lambda x: len(x) if x else 0)
            
            min_words = df['word_count_raw'].min()
            max_words = df['word_count_raw'].max()
            mean_words = df['word_count_raw'].mean()

            logging.info(f"Assessing complete:")
            logging.info(f"- Empty/Unreadable resumes found: {empty_text_count}")
            logging.info(f"- Duplicate resumes found: {duplicate_count}")
            logging.info(f"- Text Length Stats: Min word count = {min_words}, Max = {max_words}, Avg = {mean_words:.1f}")

            self.assessment_report['empty_resumes'] = int(empty_text_count)
            self.assessment_report['duplicate_resumes'] = int(duplicate_count)
            self.assessment_report['min_word_count'] = int(min_words)
            self.assessment_report['max_word_count'] = int(max_words)
            self.assessment_report['avg_word_count'] = float(mean_words)
        
        # CSV Assessment
        if self.raw_data_csv is not None:
            df_csv = self.raw_data_csv
            csv_report = {
                'total_rows': len(df_csv),
                'total_columns': len(df_csv.columns),
                'duplicate_rows': int(df_csv.duplicated().sum())
            }
            if 'ComputerSkills' in df_csv.columns:
                csv_report['missing_skills'] = int(df_csv['ComputerSkills'].isnull().sum())
            logging.info(f"CSV Assessing complete:")
            logging.info(f"- Duplicate rows: {csv_report['duplicate_rows']}")
            self.assessment_report['csv_assessment'] = csv_report
            
        return self.assessment_report

    def transform(self):
        """
        Transforms the extracted raw data into a clean, processed, structured DataFrame.
        Transformation Stage of ETL.
        """
        logging.info("Starting Transformation phase (Data Cleaning & Feature Engineering)...")
        
        if not self.raw_data_pdf and self.raw_data_csv is None:
            logging.error("No raw data to transform! Run extract() first.")
            raise ValueError("No raw data to transform! Run extract() first.")

        if self.raw_data_pdf:
            df = pd.DataFrame(self.raw_data_pdf)

            # 1. Handle missing/empty text issues from Extraction
            # Mark and logs empty texts
            df['is_empty'] = df['raw_text'].str.strip() == ""
            logging.info(f"Filtering out {df['is_empty'].sum()} empty/unreadable resumes.")
            df = df[~df['is_empty']].copy()

            # 2. Remove exact duplicate resumes based on text (standard practice for AI modeling)
            # We keep the first occurrence
            initial_len = len(df)
            df = df.drop_duplicates(subset=['raw_text'], keep='first').copy()
            removed_duplicates = initial_len - len(df)
            logging.info(f"Removed {removed_duplicates} duplicate resumes during Transformation.")

            # 3. Perform text cleaning and skill extraction
            logging.info("Cleaning resume texts...")
            df['cleaned_text'] = df['raw_text'].apply(self.clean_text)

            logging.info("Extracting keyword skills from resumes...")
            df['extracted_skills'] = df['cleaned_text'].apply(self.extract_skills_from_text)

            # 4. Feature Engineering (Adding metrics)
            df['word_count'] = df['cleaned_text'].apply(lambda x: len(x.split()))
            df['char_count'] = df['cleaned_text'].apply(len)
            df['raw_word_count'] = df['raw_text'].apply(lambda x: len(x.split()))
            df['raw_char_count'] = df['raw_text'].apply(len)

            # Drop temporary columns
            df = df.drop(columns=['is_empty'])

            self.processed_df_pdf = df
            logging.info(f"PDF Transformation complete. Cleaned DataFrame size: {len(df)} records.")
            
        if self.raw_data_csv is not None:
            df_csv = self.raw_data_csv.copy()
            logging.info("Cleaning CSV data...")
            
            initial_len = len(df_csv)
            df_csv = df_csv.drop_duplicates().copy()
            logging.info(f"Removed {initial_len - len(df_csv)} duplicate rows in CSV.")
            
            if 'ComputerSkills' in df_csv.columns:
                df_csv['ComputerSkills'] = df_csv['ComputerSkills'].fillna('')
                df_csv['cleaned_skills'] = df_csv['ComputerSkills'].astype(str).str.replace(';', ', ')
                df_csv['skill_count'] = df_csv['ComputerSkills'].apply(lambda x: len(str(x).split(';')) if x else 0)
                
            self.processed_df_csv = df_csv
            logging.info(f"CSV Transformation complete. Cleaned DataFrame size: {len(df_csv)} records.")
            
        return self.processed_df_pdf

    def load(self, output_csv_path, output_csv_path_csv=None):
        """
        Loads the structured DataFrame into a consolidated CSV file.
        Loading Stage of ETL.
        """
        logging.info(f"Starting Load phase...")
        
        try:
            if self.processed_df_pdf is not None:
                output_dir = os.path.dirname(output_csv_path)
                if output_dir and not os.path.exists(output_dir):
                    os.makedirs(output_dir, exist_ok=True)
                self.processed_df_pdf.to_csv(output_csv_path, index=False, encoding='utf-8')
                logging.info(f"Successfully loaded PDF processed data to {output_csv_path}")
                
            if self.processed_df_csv is not None and output_csv_path_csv is not None:
                output_dir_csv = os.path.dirname(output_csv_path_csv)
                if output_dir_csv and not os.path.exists(output_dir_csv):
                    os.makedirs(output_dir_csv, exist_ok=True)
                self.processed_df_csv.to_csv(output_csv_path_csv, index=False, encoding='utf-8')
                logging.info(f"Successfully loaded CSV processed data to {output_csv_path_csv}")
                
        except Exception as e:
            logging.error(f"Failed to save output CSVs: {e}")
            raise e

    def aggregate_skills(self, output_csv_path):
        """
        Aggregates skill frequencies per job category and saves to a CSV.
        """
        if self.processed_df_pdf is None:
            logging.error("No PDF processed DataFrame to aggregate skills! Run transform() first.")
            return pd.DataFrame()

        logging.info(f"Starting Skills Aggregation phase to: {output_csv_path}")

        aggregation_data = []

        # Group by category
        grouped = self.processed_df_pdf.groupby('category')
        for category, group in grouped:
            total_resumes = len(group)
            
            # Combine all skills in this category
            all_skills = []
            for skills_str in group['extracted_skills'].dropna():
                if isinstance(skills_str, str) and skills_str.strip() != "":
                    # Split comma-separated skills
                    skills_list = [s.strip() for s in skills_str.split(',')]
                    all_skills.extend(skills_list)
            
            if not all_skills:
                continue

            # Count frequency of each skill
            from collections import Counter
            counts = Counter(all_skills)
            
            for skill, count in counts.items():
                percentage = (count / total_resumes) * 100
                aggregation_data.append({
                    'category': category,
                    'total_resumes': total_resumes,
                    'skill': skill,
                    'frequency': count,
                    'percentage': round(percentage, 2)
                })

        agg_df = pd.DataFrame(aggregation_data)
        
        # Sort values for a neat report (by category, then by frequency descending)
        if not agg_df.empty:
            agg_df = agg_df.sort_values(by=['category', 'frequency'], ascending=[True, False]).reset_index(drop=True)
            
            # Ensure output directory exists
            output_dir = os.path.dirname(output_csv_path)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir, exist_ok=True)
                
            agg_df.to_csv(output_csv_path, index=False, encoding='utf-8')
            logging.info(f"Successfully aggregated skills and saved to {output_csv_path}")
            return agg_df
        else:
            logging.warning("No skills aggregated. File not saved.")
            return pd.DataFrame()

    def run_pipeline(self, output_csv_path, output_csv_path_csv=None):
        """Orchestrates the entire ETL & Assessment flow."""
        self.extract()
        self.assess()
        self.transform()
        self.load(output_csv_path, output_csv_path_csv)
        
        if self.processed_df_pdf is not None:
            # Generate skill aggregation file in the same directory as the main CSV
            base_dir = os.path.dirname(output_csv_path)
            agg_csv_path = os.path.join(base_dir, "skills_by_category.csv")
            self.aggregate_skills(agg_csv_path)
        
        return self.processed_df_pdf, self.processed_df_csv, self.assessment_report

if __name__ == "__main__":
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Adjust path dynamically if needed
    dataset_dir_pdf = os.path.join(base_dir, "Dataset Resume", "PDF")
    if not os.path.exists(dataset_dir_pdf):
        dataset_dir_pdf = os.path.join(base_dir, "Dataset Resume [PDF]") # Fallback
        
    dataset_dir_csv = os.path.join(base_dir, "Dataset Resume", "CSV", "stackoverflow_full.csv")
    if not os.path.exists(dataset_dir_csv):
        dataset_dir_csv = os.path.join(base_dir, "stackoverflow_full.csv") # Fallback
    
    output_pdf_csv = os.path.join(base_dir, "all_resumes.csv")
    output_csv_csv = os.path.join(base_dir, "all_stackoverflow_resumes.csv")
    
    logging.info("Executing Resume ETL Pipeline from CLI...")
    pipeline = ResumeETLPipeline(dataset_dir_pdf, dataset_dir_csv)
    pipeline.run_pipeline(output_pdf_csv, output_csv_csv)
    logging.info("ETL Pipeline Execution Finished Successfully!")
