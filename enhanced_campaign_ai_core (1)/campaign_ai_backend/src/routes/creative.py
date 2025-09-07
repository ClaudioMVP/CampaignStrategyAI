from flask import Blueprint, request, jsonify
import os
import uuid
from datetime import datetime

creative_bp = Blueprint('creative', __name__)

def generate_creative_prompt(campaign_data, messaging_angle, visual_theme, variation_type):
    """Generate detailed prompts for AI image generation based on campaign context and variation type"""
    
    company_name = campaign_data.get('company_name', 'Company')
    business_description = campaign_data.get('business_description', '')
    campaign_goal = campaign_data.get('campaign_goal', 'Generate Leads')
    target_audience = campaign_data.get('target_audience', '')
    
    # Extract industry context from business description
    industry_keywords = []
    if 'software' in business_description.lower() or 'tech' in business_description.lower():
        industry_keywords = ['technology', 'software', 'digital', 'cloud', 'innovation']
    elif 'consulting' in business_description.lower():
        industry_keywords = ['professional', 'business', 'strategy', 'expertise']
    elif 'marketing' in business_description.lower():
        industry_keywords = ['creative', 'branding', 'advertising', 'growth']
    else:
        industry_keywords = ['business', 'professional', 'corporate']
    
    # Base messaging angle elements
    messaging_elements = {
        'ROI-Focused': {
            'symbols': ['percentage symbols', 'dollar signs', 'upward trending arrows', 'growth charts', 'profit graphs'],
            'concepts': ['return on investment', 'cost savings', 'financial growth', 'measurable results', 'revenue increase'],
            'colors': ['green for growth', 'blue for trust', 'gold for value']
        },
        'Time-Saving': {
            'symbols': ['clock icons', 'calendar elements', 'efficiency arrows', 'streamlined processes', 'automation symbols'],
            'concepts': ['time efficiency', 'productivity boost', 'workflow optimization', 'quick results', 'streamlined operations'],
            'colors': ['blue for efficiency', 'orange for energy', 'green for progress']
        },
        'Competitive Advantage': {
            'symbols': ['comparison charts', 'leadership arrows', 'winner podiums', 'competitive graphs', 'market position indicators'],
            'concepts': ['market leadership', 'competitive edge', 'industry innovation', 'superior performance', 'strategic advantage'],
            'colors': ['blue for authority', 'red for power', 'purple for premium']
        }
    }
    
    # Visual theme styling
    theme_styles = {
        'Professional Authority': {
            'style': 'clean corporate design with professional photography',
            'elements': ['business professionals', 'corporate environments', 'authoritative layouts', 'enterprise imagery'],
            'mood': 'trustworthy, authoritative, enterprise-ready',
            'layout': 'structured grid layout with clear hierarchy'
        },
        'Data-Driven Results': {
            'style': 'analytical dashboard design with data visualization',
            'elements': ['charts and graphs', 'analytics dashboards', 'performance metrics', 'data visualization'],
            'mood': 'analytical, results-focused, evidence-based',
            'layout': 'dashboard-style layout with prominent data displays'
        },
        'Innovation Leadership': {
            'style': 'modern tech aesthetic with cutting-edge design',
            'elements': ['futuristic imagery', 'tech innovation symbols', 'progressive design elements', 'forward-thinking visuals'],
            'mood': 'innovative, progressive, industry-leading',
            'layout': 'dynamic asymmetrical layout with modern typography'
        }
    }
    
    # Variation-specific approaches
    variation_approaches = {
        'concept_focused': {
            'emphasis': 'conceptual illustration with symbolic representation',
            'approach': 'abstract and symbolic with clear messaging hierarchy'
        },
        'data_visualization': {
            'emphasis': 'data-driven visual with charts and metrics',
            'approach': 'infographic style with prominent statistics and performance indicators'
        },
        'lifestyle_context': {
            'emphasis': 'real-world application with people and environments',
            'approach': 'lifestyle photography with contextual business scenarios'
        }
    }
    
    msg_data = messaging_elements.get(messaging_angle, messaging_elements['ROI-Focused'])
    theme_data = theme_styles.get(visual_theme, theme_styles['Professional Authority'])
    var_data = variation_approaches.get(variation_type, variation_approaches['concept_focused'])
    
    # Build comprehensive prompt
    prompt = f"""Create a professional marketing campaign creative for {company_name}, a {' '.join(industry_keywords)} company. 

Campaign Context:
- Goal: {campaign_goal}
- Industry: {', '.join(industry_keywords)}
- Target Audience: {target_audience[:200]}

Messaging Angle - {messaging_angle}:
- Key symbols: {', '.join(msg_data['symbols'][:3])}
- Core concepts: {', '.join(msg_data['concepts'][:3])}
- Color palette: {', '.join(msg_data['colors'])}

Visual Theme - {visual_theme}:
- Style: {theme_data['style']}
- Visual elements: {', '.join(theme_data['elements'][:3])}
- Mood: {theme_data['mood']}
- Layout: {theme_data['layout']}

Variation Approach - {variation_type.replace('_', ' ').title()}:
- Emphasis: {var_data['emphasis']}
- Creative approach: {var_data['approach']}

Design Requirements:
- High-quality, professional marketing creative
- Clear visual hierarchy with compelling headline space
- Incorporate company branding elements
- Suitable for digital marketing campaigns
- Modern, clean aesthetic that appeals to the target audience
- Include space for call-to-action elements
- Ensure the creative clearly communicates the {messaging_angle.lower()} message through {visual_theme.lower()} styling

Technical specs: 16:9 landscape format, marketing campaign ready, professional quality, clean composition"""
    
    return prompt

@creative_bp.route('/generate-creative', methods=['POST'])
def generate_creative():
    """Generate 3 creative variations based on campaign context"""
    try:
        data = request.get_json()
        
        # Extract campaign data
        campaign_data = {
            'company_name': data.get('company_name', ''),
            'business_description': data.get('business_description', ''),
            'campaign_goal': data.get('campaign_goal', ''),
            'target_audience': data.get('target_audience', ''),
            'monthly_budget': data.get('monthly_budget', ''),
            'target_areas': data.get('target_areas', '')
        }
        
        messaging_angle = data.get('messaging_angle', 'ROI-Focused')
        visual_theme = data.get('visual_theme', 'Professional Authority')
        
        # Generate 3 different creative variations
        variations = [
            {
                'id': 'concept_focused',
                'title': 'Concept-Driven Creative',
                'description': 'Symbolic and conceptual approach emphasizing core messaging through visual metaphors',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'concept_focused')
            },
            {
                'id': 'data_visualization',
                'title': 'Data-Driven Creative',
                'description': 'Infographic-style design highlighting key metrics and performance indicators',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'data_visualization')
            },
            {
                'id': 'lifestyle_context',
                'title': 'Contextual Creative',
                'description': 'Real-world application showing the solution in action with target audience',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'lifestyle_context')
            }
        ]
        
        # Return the prompts and metadata for frontend to handle image generation
        response = {
            'success': True,
            'campaign_context': {
                'company_name': campaign_data['company_name'],
                'messaging_angle': messaging_angle,
                'visual_theme': visual_theme,
                'campaign_goal': campaign_data['campaign_goal']
            },
            'creative_variations': variations,
            'generation_timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@creative_bp.route('/analyze-context', methods=['POST'])
def analyze_context():
    """Analyze campaign context to provide insights for creative generation"""
    try:
        data = request.get_json()
        
        business_description = data.get('business_description', '').lower()
        target_audience = data.get('target_audience', '').lower()
        
        # Industry analysis
        industry_insights = []
        if any(keyword in business_description for keyword in ['software', 'tech', 'cloud', 'digital']):
            industry_insights.append('Technology sector - emphasize innovation and efficiency')
        if any(keyword in business_description for keyword in ['consulting', 'advisory', 'strategy']):
            industry_insights.append('Professional services - focus on expertise and results')
        if any(keyword in business_description for keyword in ['marketing', 'advertising', 'creative']):
            industry_insights.append('Marketing industry - highlight creativity and growth')
        
        # Audience analysis
        audience_insights = []
        if any(keyword in target_audience for keyword in ['small business', 'startup', 'entrepreneur']):
            audience_insights.append('Small business focus - emphasize cost-effectiveness and growth')
        if any(keyword in target_audience for keyword in ['enterprise', 'large company', 'corporation']):
            audience_insights.append('Enterprise focus - highlight scalability and reliability')
        if any(keyword in target_audience for keyword in ['manager', 'director', 'executive']):
            audience_insights.append('Decision-maker audience - focus on ROI and strategic value')
        
        # Messaging recommendations
        messaging_recommendations = {
            'ROI-Focused': 'Recommended for cost-conscious audiences and B2B campaigns',
            'Time-Saving': 'Ideal for busy professionals and efficiency-focused messaging',
            'Competitive Advantage': 'Perfect for competitive markets and differentiation strategies'
        }
        
        # Visual theme recommendations
        theme_recommendations = {
            'Professional Authority': 'Best for B2B, enterprise, and trust-building campaigns',
            'Data-Driven Results': 'Ideal for analytical audiences and performance-focused messaging',
            'Innovation Leadership': 'Perfect for tech companies and forward-thinking brands'
        }
        
        return jsonify({
            'success': True,
            'industry_insights': industry_insights,
            'audience_insights': audience_insights,
            'messaging_recommendations': messaging_recommendations,
            'theme_recommendations': theme_recommendations
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

