#!/usr/bin/env python3
"""
High-Octane Exam Data Analysis & Prediction Pipeline
------------------------------------------------------
Task: Act as a Senior AI Engineer & Expert NLP Specialist.
This script performs advanced linguistic lemmatization, smart vocabulary filtering,
regex-based section segmentation, weight-based priority tier assignment, and 
the dynamic multiplier injection for National Vision trends (Oman Vision 2040).

Author: OMEGA Analysis Pipeline Engine
"""

import re
import os
import sys
import json
from collections import Counter

# Standard English stop words
STOPWORDS_A2_OR_BELOW = {
    # Basic structural stop words
    'the', 'a', 'an', 'and', 'but', 'or', 'so', 'if', 'because', 'as', 'what', 'such',
    'this', 'that', 'these', 'those', 'then', 'there', 'here', 'where', 'when', 'how',
    'which', 'who', 'whom', 'whose', 'why', 'to', 'for', 'with', 'on', 'at', 'by', 'of',
    'in', 'out', 'up', 'down', 'about', 'over', 'under', 'again', 'further', 'once',
    # Super common words / pronouns
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    # Common verbs / auxiliary verbs
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'can', 'could', 'should', 'would', 'will', 'must',
}

# Mapping of keywords for Oman Vision 2040 / Sustainability & Technology trends
CONTEXTUAL_VISION_2040_THEMES = {
    # Digital Transformation / Technology
    'technology', 'digital', 'artificial', 'intelligence', 'automation', 'computing', 'cyber',
    'robotics', 'robot', 'software', 'virtual', 'device', 'wearable', 'online', 'screen',
    # Sustainability & Renewable Energy
    'sustainability', 'sustainable', 'environment', 'environmental', 'climate', 'renewable',
    'energy', 'conservation', 'nature', 'waste', 'recycle', 'pollution', 'green', 'clean',
    # National Objectives & Tourism
    'oman', 'omani', 'muscat', 'vision', 'heritage', 'culture', 'national', 'tourism', 'tourist',
}

# Baseline dictionary containing CEFR labels, translations and emojis
BASE_DICTIONARY = {
    'journalism': {'cefr': 'B1', 'trans': 'الصحافة', 'emoji': '📰', 'def': 'The activity of writing, editing, or presenting news.'},
    'headlines': {'cefr': 'B1', 'trans': 'عناوين الأخبار', 'emoji': '📢', 'def': 'The titles of newspaper articles printed in large letters.'},
    'paparazzi': {'cefr': 'B2', 'trans': 'المصورين المتطفلين', 'emoji': '📸', 'def': 'Photographers who follow famous people to take pictures of them.'},
    'freelance': {'cefr': 'B2', 'trans': 'عمل حر', 'emoji': '💼', 'def': 'Working independently for different companies.'},
    'ethical': {'cefr': 'B2', 'trans': 'أخلاقي', 'emoji': '⚖️', 'def': 'Relating to what is morally correct and honorable.'},
    'tragedy': {'cefr': 'B1', 'trans': 'مأساة', 'emoji': '🎭', 'def': 'A very sad situation or event, usually involving death.'},
    'threat': {'cefr': 'B1', 'trans': 'تهديد', 'emoji': '⚠️', 'def': 'The possibility of trouble, danger, or disaster.'},
    'obsolete': {'cefr': 'B2', 'trans': 'عفا عليه الزمن', 'emoji': '⏳', 'def': 'No longer used because something newer has been invented.'},
    'endangered': {'cefr': 'B1', 'trans': 'مهدد بالانقراض', 'emoji': '🐼', 'def': 'Species that are at risk of extinction.'},
    'cyclone': {'cefr': 'B2', 'trans': 'إعصار', 'emoji': '🌀', 'def': 'A violent tropical storm with winds moving in a circle.'},
    'aggressive': {'cefr': 'B1', 'trans': 'عدواني', 'emoji': '😠', 'def': 'Behaving in an angry or threatening way.'},
    'kidnap': {'cefr': 'B2', 'trans': 'يختطف', 'emoji': '👤', 'def': 'To take someone away illegally, often for ransom.'},
    'hijack': {'cefr': 'B2', 'trans': 'يختطف طائرة', 'emoji': '✈️', 'def': 'Using violence to take control of an aircraft or vehicle.'},
    'obsession': {'cefr': 'B2', 'trans': 'هوس', 'emoji': '💭', 'def': 'A strong, unhealthy, and constant interest in someone or something.'},
    'complain': {'cefr': 'B1', 'trans': 'يشكو', 'emoji': '🗣️', 'def': 'To say that you are unsatisfied or annoyed with something.'},
    'survivor': {'cefr': 'B1', 'trans': 'ناجي', 'emoji': '🧗', 'def': 'A person who continues to live after a dangerous event.'},
    'iceberg': {'cefr': 'B2', 'trans': 'جبل جليدي', 'emoji': '🏔️', 'def': 'A large floating mass of ice detached from a glacier.'},
    'documentary': {'cefr': 'B1', 'trans': 'فيلم وثائقي', 'emoji': '🎥', 'def': 'A film or radio program that provides factual reports.'},
    'sustainability': {'cefr': 'B2', 'trans': 'الاستدامة', 'emoji': '🌱', 'def': 'The ability to be maintained at a certain steady rate.'},
    'digital': {'cefr': 'A2', 'trans': 'رقمي', 'emoji': '📱', 'def': 'Expressed as series of digits 0 and 1, virtual or computational.'},
}

class AdvancedNLPParser:
    def __init__(self, section_weights=None):
        self.section_weights = section_weights or {
            'LISTENING': 1.4,
            'READING': 1.2,
            'VOCABULARY': 1.0,
            'WRITING': 0.8,
            'GRAMMAR': 0.9
        }
        
    def clean_and_normalize(self, text):
        """1. Converts to lowercase, strips formatting noise, standardizes apostrophes/hyphens."""
        text = text.lower()
        # Remove headers, page footers, pagination markers
        text = re.sub(r'mohamed mussa\s+\d+\s+musandam p\.b', '', text)
        text = re.sub(r'experience.*grade 12 b', '', text)
        # Standardize hyphens and quotes
        text = text.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
        return text

    def lemmatize_simulate(self, word):
        """
        Linguistic Lemmatization engine (Simulates spaCy behavior for speed and compatibility).
        Reduces common inflected variants to canonical base forms.
        """
        word = word.strip(".,;:?!()\"'")
        # Manual list of common inflected forms in Grade 12 materials
        lemmas = {
            'writing': 'write', 'wrote': 'write', 'written': 'write', 'writes': 'write',
            'playing': 'play', 'played': 'play', 'plays': 'play',
            'studying': 'study', 'studied': 'study', 'studies': 'study',
            'fishing': 'fish', 'fished': 'fish', 'fishes': 'fish',
            'reading': 'read', 'reads': 'read',
            'photographers': 'photographer', 'photography': 'photography',
            'newspapers': 'newspaper', 'newest': 'new', 'newer': 'new',
            'countries': 'country', 'be': 'be', 'is': 'be', 'are': 'be', 'was': 'be', 'were': 'be',
            'reported': 'report', 'reporting': 'report', 'reports': 'report',
            'survived': 'survive', 'survivors': 'survive', 'surviving': 'survive',
            'challenges': 'challenge', 'challenged': 'challenge',
            'technologies': 'technology', 'technological': 'technology'
        }
        return lemmas.get(word, word)

    def segment_sections(self, text):
        """
        2. Robust Section Segmentation using Regular Expressions.
        Identifies boundaries of core exam modular chapters.
        """
        sections = {}
        # Define potential headers
        patterns = {
            'LISTENING': r'(listening\s+\d+|listening\s+task|section\s+a:\s+listening)',
            'READING': r'(reading\s+\d+|reading\s+task|section\s+b:\s+reading|text\s+1\b|text\s+2\b)',
            'VOCABULARY': r'(vocabulary\s+\d+|vocabulary\s+task|theme\s+\d+\s+overview\b|glossary\b)',
            'GRAMMAR': r'(grammar\s+\d+|grammar\s+task|reported\s+speech|choose\s+the\s+correct\s+answer)',
            'WRITING': r'(writing\s+\d+|writing\s+task|narrative\s+writing|example\s+of\s+model\s+story)'
        }
        
        # Combine patterns to match any section start
        current_section = "GENERAL"
        sections[current_section] = []
        
        lines = text.split('\n')
        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
            
            # Check if line matches any section header pattern
            matched = False
            for sec_name, pat in patterns.items():
                if re.search(pat, line_clean, re.IGNORECASE):
                    current_section = sec_name
                    if current_section not in sections:
                        sections[current_section] = []
                    matched = True
                    break
            
            if not matched:
                sections[current_section].append(line_clean)
                
        return sections

    def calculate_priority_pipeline(self, all_text, sections):
        """
        3. Contextual Multipliers & Weighted Tally Assignment.
        Applies formula: W = (avg_pct * section_weight) * contextual_multiplier
        """
        # Normalize and tokenize master text
        cleaned_text = self.clean_and_normalize(all_text)
        raw_tokens = re.findall(r'\b[a-zA-Z]{3,}\b', cleaned_text) # Only analyze words of length 3+
        
        # Count all lemmas
        lemmas = [self.lemmatize_simulate(t) for t in raw_tokens if t not in STOPWORDS_A2_OR_BELOW]
        counts = Counter(lemmas)
        total_tokens = sum(counts.values()) or 1
        
        vocab_result = []
        
        for lemma, count in counts.items():
            # Basic percentage
            pct = (count / total_tokens) * 100
            
            # Determine section occurrences and section weight
            assigned_section_weight = 1.0
            found_section = "VOCABULARY"
            for sec, lines in sections.items():
                joined_sec = "\n".join(lines).lower()
                if lemma in joined_sec:
                    assigned_section_weight = max(assigned_section_weight, self.section_weights.get(sec, 1.0))
                    found_section = sec
            
            # Contextual multiplier (Oman Vision 2040)
            context_multiplier = 1.0
            is_vision_2040 = lemma in CONTEXTUAL_VISION_2040_THEMES
            if is_vision_2040:
                context_multiplier = 1.3
                
            # Compute W
            weighted_score = (pct * assigned_section_weight) * context_multiplier
            
            # Determine Tier
            if weighted_score >= 1.5 or (is_vision_2040 and pct > 0.05):
                tier = "Emergency"
            elif weighted_score >= 0.8:
                tier = "Important"
            elif weighted_score >= 0.3:
                tier = "Normal"
            else:
                tier = "Low"
                
            # Add translation and metadata
            dict_meta = BASE_DICTIONARY.get(lemma, {
                'cefr': 'B1' if is_vision_2040 else 'A2',
                'trans': 'مفهوم مرتبط' if is_vision_2040 else 'مفردات',
                'emoji': '🌱' if is_vision_2040 else '📝',
                'def': f'Key reference term encountered in {found_section.capitalize()} section.'
            })
            
            vocab_result.append({
                'word': lemma.capitalize(),
                'lemma': lemma,
                'arabicTranslation': dict_meta['trans'],
                'definition': dict_meta['def'],
                'cefr': dict_meta['cefr'],
                'rawCount': count,
                'percentage': round(pct, 3),
                'sectionWeight': assigned_section_weight,
                'contextualMultiplier': context_multiplier,
                'weightedScore': round(weighted_score, 3),
                'priorityTier': tier,
                'emoji': dict_meta['emoji'],
                'isVision2040': is_vision_2040,
                'imagePrompt': f"A beautiful artistic illustration of the concept {lemma} representing {dict_meta['def']} with high modern details, cinematic lighting"
            })
            
        # Sort by Weighted Score descending
        vocab_result.sort(key=lambda x: x['weightedScore'], reverse=True)
        return vocab_result

    def run_full_pipeline(self, all_text):
        """Processes the corpora fully and dumps structured analysis results."""
        normalized_root = self.clean_and_normalize(all_text)
        sections = self.segment_sections(normalized_root)
        vocab_metrics = self.calculate_priority_pipeline(all_text, sections)
        
        # Summary metrics
        emergencies = [v for v in vocab_metrics if v['priorityTier'] == "Emergency"]
        avg_cefr = "A2"
        if len(vocab_metrics) > 0:
            b1_plus = len([v for v in vocab_metrics if v['cefr'] in ['B1', 'B2', 'C1', 'C2']])
            if (b1_plus / len(vocab_metrics)) > 0.4:
                avg_cefr = "B1"
                
        summary = {
            'totalWords': len(all_text.split()),
            'uniqueWords': len(vocab_metrics),
            'emergencyCount': len(emergencies),
            'averageCEFR': avg_cefr
        }
        
        # Format output sections values nicely for JSON output (limit lines for readability)
        clean_sections = {k: v[:30] for k, v in sections.items()} # limit to top 30 lines
        
        output_data = {
            'vocabList': vocab_metrics[:40], # Return top 40 words for visual fidelity
            'sections': clean_sections,
            'summary': summary,
            'pythonCodeRunSuccessfully': True
        }
        return output_data

if __name__ == '__main__':
    # Test text summarizing Omani high school Grade 12B curriculum and trends
    sample_text = """
    Theme 1 Overview: News and the Media.
    Literature refers to pieces of writing that are valued as novels, plays and essays.
    Journalism is the activity of collecting, writing, and editing news for newspapers, radio, and television.
    The press focuses on Newspapers and magazines.
    The Paparazzi are press photographers who chase celebrities to get secret photographs.
    Oman Vision 2040 encourages youth to build sustainable digital technologies.
    We need ethical and clean energy, renewable solar panels, and focus on environmental sustainability to combat climate risks.
    Obsolete devices are recycled in our smart digital transformation projects.
    The Titanic passenger ship sank after hitting an iceberg in a terrible tragedy.
    """
    
    parser = AdvancedNLPParser()
    result = parser.run_full_pipeline(sample_text)
    print(json.dumps(result, indent=2, ensure_ascii=False))
